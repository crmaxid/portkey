export interface LogoProps {
  [key: string]: unknown;
}

export interface Project {
  id: string;
  total_members: number;
  total_cycles: number;
  total_modules: number;
  is_member: boolean;
  sort_order: number;
  member_role: number;
  is_deployed: boolean;
  cover_image_url: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  name: string;
  description: string;
  description_text: string | null;
  description_html: string | null;
  network: number;
  identifier: string;
  emoji: string | null;
  icon_prop: string | null;
  module_view: boolean;
  cycle_view: boolean;
  issue_views_view: boolean;
  page_view: boolean;
  intake_view: boolean;
  is_time_tracking_enabled: boolean;
  is_issue_type_enabled: boolean;
  guest_view_all_features: boolean;
  cover_image: string | null;
  archive_in: number;
  close_in: number;
  logo_props: LogoProps;
  archived_at: string | null;
  timezone: string;
  external_source: string | null;
  external_id: string | null;
  created_by: string;
  updated_by: string;
  workspace: string;
  default_assignee: string | null;
  project_lead: string | null;
  cover_image_asset: string | null;
  estimate: string | null;
  default_state: string | null;
}

export interface State {
  id: string;
  name: string;
  color: string;
  slug: string;
  description: string;
  sequence: number;
  group: 'backlog' | 'unstarted' | 'started' | 'completed' | 'cancelled';
  is_triage: boolean;
  default: boolean;
  external_source: string | null;
  external_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  project: string;
  workspace: string;
  created_by: string;
  updated_by: string | null;
}

export interface WorkItem {
  id: string;
  sequence_id: number;
  name: string;
  description_html: string | null;
  description_stripped: string | null;
  priority: 'urgent' | 'high' | 'medium' | 'low' | 'none';
  start_date: string | null;
  target_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  project: string;
  workspace: string;
  state: string;
  created_by: string;
  updated_by: string;
  assignees: string[];
  label_ids: string[];
  parent: string | null;
}

export interface WorkItemLink {
  id: string;
  title: string;
  url: string;
  created_at: string;
  updated_at: string;
  work_item: string;
  created_by: string;
}

export interface PaginatedResponse<T> {
  grouped_by: string | null;
  sub_grouped_by: string | null;
  total_count: number;
  next_cursor: string;
  prev_cursor: string;
  next_page_results: boolean;
  prev_page_results: boolean;
  count: number;
  total_pages: number;
  total_results: number;
  extra_stats: unknown | null;
  results: T[];
}

export type ProjectListResponse = PaginatedResponse<Project>;
export type WorkItemListResponse = PaginatedResponse<WorkItem>;
