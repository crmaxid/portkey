import { planeAxios } from '../config/axios';
import type {
  Project,
  ProjectListResponse,
  State,
  WorkItem,
  WorkItemLink,
  WorkItemListResponse,
} from '../types';

export const getProjects = async (workspace: string) => {
  const response = await planeAxios.get<ProjectListResponse>(`/workspaces/${workspace}/projects`);
  return response.data;
};

export const getOneProject = async (workspace: string, projectIdentifier: string) => {
  const projects = await getProjects(workspace);
  const project = projects.results.find((p) => p.identifier === projectIdentifier.toUpperCase());

  if (!project)
    throw new Error(`Project '${projectIdentifier}' not found in workspace '${workspace}'`);

  const response = await planeAxios.get<Project>(`/workspaces/${workspace}/projects/${project.id}`);
  return response.data;
};

export const getStates = async (workspace: string, projectId: string) => {
  const response = await planeAxios.get<State[]>(
    `/workspaces/${workspace}/projects/${projectId}/states`,
  );
  return response.data;
};

export const getStateByName = async (workspace: string, projectId: string, stateName: string) => {
  const states = await getStates(workspace, projectId);
  const state = states.find((s) => s.name.toLowerCase() === stateName.toLowerCase());

  if (!state) throw new Error(`State '${stateName}' not found`);

  return state;
};

export const getWorkItems = async (workspace: string, projectId: string) => {
  const response = await planeAxios.get<WorkItemListResponse>(
    `/workspaces/${workspace}/projects/${projectId}/work-items`,
  );
  return response.data;
};

export const getWorkItemBySequenceId = async (
  workspace: string,
  projectId: string,
  sequenceId: number,
) => {
  const workItems = await getWorkItems(workspace, projectId);
  const workItem = workItems.results.find((w) => w.sequence_id === sequenceId);

  if (!workItem) throw new Error(`Work item #${sequenceId} not found`);

  return workItem;
};

export const updateWorkItemState = async (
  workspace: string,
  projectId: string,
  workItemId: string,
  stateId: string,
) => {
  const response = await planeAxios.patch<WorkItem>(
    `/workspaces/${workspace}/projects/${projectId}/work-items/${workItemId}`,
    { state: stateId },
  );
  return response.data;
};

export const addWorkItemLink = async (
  workspace: string,
  projectId: string,
  workItemId: string,
  title: string,
  url: string,
) => {
  const response = await planeAxios.post<WorkItemLink>(
    `/workspaces/${workspace}/projects/${projectId}/work-items/${workItemId}/links`,
    { title, url },
  );
  return response.data;
};

export const parseBranchName = (
  branch: string,
): { projectIdentifier: string; sequenceId: number } | null => {
  const match = branch.match(/^([A-Z][A-Z0-9]*)-(\d+)$/i);
  const [, identifier, sequence] = match ?? [];
  if (!identifier || !sequence) return null;
  return {
    projectIdentifier: identifier.toUpperCase(),
    sequenceId: parseInt(sequence, 10),
  };
};

export const resolveWorkItemFromBranch = async (workspace: string, branch: string) => {
  const parsed = parseBranchName(branch);
  if (!parsed) throw new Error(`Branch '${branch}' does not match pattern <PROJECT>-<number>`);

  const { projectIdentifier, sequenceId } = parsed;

  const project = await getOneProject(workspace, projectIdentifier);
  const workItem = await getWorkItemBySequenceId(workspace, project.id, sequenceId);

  return { project, workItem };
};
