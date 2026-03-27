import 'dotenv/config';
import type { SocialPost } from './post-generator';
import type { Platform } from './tone-analyzer';
import type { ImageURLMap } from './image-uploader';

const API_BASE = 'https://api.sproutsocial.com';

function getToken(): string {
  const token = process.env.SPROUT_API_TOKEN;
  if (!token) {
    throw new Error('SPROUT_API_TOKEN not set. Add it to pearl-social/.env');
  }
  return token;
}

async function sproutFetch(path: string, options: RequestInit = {}): Promise<any> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Sprout API ${res.status}: ${body}`);
  }

  return res.json();
}

// --- Metadata ---

export interface SproutCustomer {
  customer_id: number;
  name: string;
}

export interface SproutProfile {
  customer_profile_id: number;
  network_type: string;
  name: string;
  groups: number[];
}

export interface SproutGroup {
  group_id: number;
  name: string;
}

export interface SproutTag {
  tag_id: number;
  text: string;
  type: string;
  groups: number[];
}

export async function getCustomers(): Promise<SproutCustomer[]> {
  const res = await sproutFetch('/v1/metadata/client');
  return res.data;
}

export async function getProfiles(customerId: number): Promise<SproutProfile[]> {
  const res = await sproutFetch(`/v1/${customerId}/metadata/customer`);
  return res.data;
}

export async function getGroups(customerId: number): Promise<SproutGroup[]> {
  const res = await sproutFetch(`/v1/${customerId}/metadata/customer/groups`);
  return res.data;
}

export async function getTags(customerId: number): Promise<SproutTag[]> {
  const res = await sproutFetch(`/v1/${customerId}/metadata/customer/tags`);
  return res.data;
}

// --- Media Upload ---

export interface SproutMedia {
  media_id: string;
  expiration_time: string;
}

/** Upload an image to Sprout from a public URL */
export async function uploadMediaFromUrl(customerId: number, imageUrl: string): Promise<SproutMedia> {
  const formData = new FormData();
  formData.append('media_url', imageUrl);

  const token = getToken();
  const res = await fetch(`${API_BASE}/v1/${customerId}/media/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    body: formData,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Sprout media upload ${res.status}: ${body}`);
  }

  const json = await res.json();
  return json.data[0];
}

// --- Publishing ---

export interface PublishResult {
  publishing_post_id: number;
  perma_link: string;
  platform: string;
  profileName: string;
}

const PLATFORM_TO_NETWORK: Record<Platform, string[]> = {
  linkedin: ['linkedin'],
  x: ['twitter'],
  meta: ['facebook'],
  instagram: ['instagram'],
  bluesky: ['bluesky'],
};

/** Find the matching Sprout profile for a platform */
function findProfile(profiles: SproutProfile[], platform: Platform): SproutProfile | null {
  const networkTypes = PLATFORM_TO_NETWORK[platform];
  return profiles.find(p => networkTypes.some(n => p.network_type.toLowerCase().includes(n))) || null;
}

export interface PublishOptions {
  customerId: number;
  groupId: number;
  profiles: SproutProfile[];
  imageUrls: ImageURLMap;
  tagIds?: number[];
  scheduledTimes: Record<'initial' | 'followup' | 'vip_quote', string>;
}

/**
 * Publishes posts to Sprout Social as drafts.
 * Each post is created with the correct profile, schedule, media, and campaign tags.
 */
export async function publishToSprout(
  posts: SocialPost[],
  options: PublishOptions
): Promise<PublishResult[]> {
  const results: PublishResult[] = [];

  // Upload media once per graphic type
  const mediaCache: Record<string, string> = {};

  async function getMediaId(imageUrl: string | null): Promise<string | null> {
    if (!imageUrl) return null;
    if (mediaCache[imageUrl]) return mediaCache[imageUrl];

    const media = await uploadMediaFromUrl(options.customerId, imageUrl);
    mediaCache[imageUrl] = media.media_id;
    return media.media_id;
  }

  for (const post of posts) {
    const profile = findProfile(options.profiles, post.platform);
    if (!profile) {
      console.warn(`   ⚠ No Sprout profile found for ${post.platform}, skipping`);
      continue;
    }

    // Get image URL and upload
    const imageUrl = getImageUrlForPost(post, options.imageUrls);
    const mediaId = await getMediaId(imageUrl);

    const scheduledTime = options.scheduledTimes[post.postType];

    const body: any = {
      group_id: options.groupId,
      customer_profile_ids: [profile.customer_profile_id],
      is_draft: true,
      text: post.content,
      delivery: {
        type: 'SCHEDULED',
        scheduled_times: [scheduledTime],
      },
    };

    if (mediaId) {
      body.media = [{ media_id: mediaId, media_type: 'PHOTO' }];
    }

    if (options.tagIds && options.tagIds.length > 0) {
      body.tag_ids = options.tagIds;
    }

    const res = await sproutFetch(`/v1/${options.customerId}/publishing/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const created = res.data[0];
    results.push({
      publishing_post_id: created.internal.publishing.publishing_post_id,
      perma_link: created.internal.publishing.perma_link,
      platform: post.platform,
      profileName: profile.name,
    });

    console.log(`   ✓ ${post.platform} (${post.postType}) → draft created`);
  }

  return results;
}

function getImageUrlForPost(post: SocialPost, imageUrls: ImageURLMap): string | null {
  switch (post.postType) {
    case 'initial':
      return imageUrls.initialUrl;
    case 'followup':
      return imageUrls.repostUrl;
    case 'vip_quote':
      if (post.quoteAttribution && imageUrls.quoteUrls[post.quoteAttribution]) {
        return imageUrls.quoteUrls[post.quoteAttribution];
      }
      return null;
    default:
      return null;
  }
}

/** Interactive setup: fetch and display account metadata */
export async function discoverAccount(): Promise<{
  customerId: number;
  groupId: number;
  profiles: SproutProfile[];
  tags: SproutTag[];
}> {
  console.log('🔍 Discovering Sprout Social account...\n');

  const customers = await getCustomers();
  if (customers.length === 0) throw new Error('No Sprout Social customers found for this token.');
  const customer = customers[0];
  console.log(`   Customer: ${customer.name} (ID: ${customer.customer_id})`);

  const groups = await getGroups(customer.customer_id);
  if (groups.length === 0) throw new Error('No groups found.');
  const group = groups[0];
  console.log(`   Group: ${group.name} (ID: ${group.group_id})`);

  const profiles = await getProfiles(customer.customer_id);
  console.log(`   Profiles:`);
  for (const p of profiles) {
    console.log(`     - ${p.name} (${p.network_type}, ID: ${p.customer_profile_id})`);
  }

  const tags = await getTags(customer.customer_id);
  const campaigns = tags.filter(t => t.type === 'CAMPAIGN');
  if (campaigns.length > 0) {
    console.log(`   Campaigns:`);
    for (const t of campaigns) {
      console.log(`     - ${t.text} (ID: ${t.tag_id})`);
    }
  }

  console.log('');
  return { customerId: customer.customer_id, groupId: group.group_id, profiles, tags };
}
