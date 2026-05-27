import { planeClient } from '../config';

export const getProjects = async (workspace: string) => {
  const { results } = await planeClient.projects.list(workspace);
  return { results };
};

export const getOneProject = async (workspace: string, projectIdentifier: string) => {
  const { results } = await planeClient.projects.list(workspace);
  const project = results.find((p) => p.identifier === projectIdentifier.toUpperCase());

  if (!project)
    throw new Error(`Project '${projectIdentifier}' not found in workspace '${workspace}'`);

  return project;
};

export const getStates = async (workspace: string, projectId: string) => {
  const { results } = await planeClient.states.list(workspace, projectId);
  return results;
};

export const getStateByName = async (workspace: string, projectId: string, stateName: string) => {
  const states = await getStates(workspace, projectId);
  const state = states.find((s) => s.name.toLowerCase() === stateName.toLowerCase());

  if (!state) throw new Error(`State '${stateName}' not found`);

  return state;
};

export const updateWorkItemState = async (
  workspace: string,
  projectId: string,
  workItemId: string,
  stateId: string,
) => {
  return planeClient.workItems.update(workspace, projectId, workItemId, { state: stateId });
};

export const addWorkItemLink = async (
  workspace: string,
  projectId: string,
  workItemId: string,
  title: string,
  url: string,
) => {
  return planeClient.workItems.links.create(workspace, projectId, workItemId, { title, url });
};

export const parseBranchName = (
  branch: string,
): { projectIdentifier: string; sequenceId: number; identifier: string } | null => {
  const match = branch.match(/([A-Za-z][A-Za-z0-9]*)-(\d+)/);
  const [, identifier, sequence] = match ?? [];
  if (!identifier || !sequence) return null;
  return {
    projectIdentifier: identifier.toUpperCase(),
    sequenceId: parseInt(sequence, 10),
    identifier: `${identifier.toUpperCase()}-${sequence}`,
  };
};

export const resolveWorkItemFromBranch = async (workspace: string, branch: string) => {
  const parsed = parseBranchName(branch);
  if (!parsed) throw new Error(`Branch '${branch}' does not match pattern <PROJECT>-<number>`);

  const workItem = await planeClient.workItems.retrieveByIdentifier(workspace, parsed.identifier);

  return { projectId: workItem.project, workItem };
};
