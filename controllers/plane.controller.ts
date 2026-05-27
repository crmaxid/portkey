import { Router, type Request, type Response, type NextFunction } from 'express';
import {
  addWorkItemLink,
  getOneProject,
  getProjects,
  getStateByName,
  getStates,
  resolveWorkItemFromBranch,
  updateWorkItemState,
} from '../services';

const PlaneRouter = Router();

const param = (value: string | string[] | undefined, name: string): string => {
  if (!value || Array.isArray(value)) throw new Error(`Missing route param: ${name}`);
  return value;
};

PlaneRouter.get('/:workspace/projects', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspace = param(req.params['workspace'], 'workspace');
    const data = await getProjects(workspace);
    res.success(data);
  } catch (error) {
    next(error);
  }
});

PlaneRouter.get(
  '/:workspace/projects/:projectIdentifier',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspace = param(req.params['workspace'], 'workspace');
      const projectIdentifier = param(req.params['projectIdentifier'], 'projectIdentifier');
      const data = await getOneProject(workspace, projectIdentifier);
      res.success(data);
    } catch (error) {
      next(error);
    }
  },
);

PlaneRouter.get(
  '/:workspace/projects/:projectIdentifier/states',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspace = param(req.params['workspace'], 'workspace');
      const projectIdentifier = param(req.params['projectIdentifier'], 'projectIdentifier');
      const project = await getOneProject(workspace, projectIdentifier);
      const data = await getStates(workspace, project.id);
      res.success(data);
    } catch (error) {
      next(error);
    }
  },
);

PlaneRouter.post(
  '/:workspace/branch/link',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspace = param(req.params['workspace'], 'workspace');
      const { branch, url, title } = req.body as {
        branch: string;
        url: string;
        title?: string;
      };

      if (!branch || !url) return res.fail('branch and url are required');

      const { projectId, workItem } = await resolveWorkItemFromBranch(workspace, branch);

      const data = await addWorkItemLink(
        workspace,
        projectId,
        workItem.id,
        title ?? `Branch: ${branch}`,
        url,
      );

      res.success(data, 'Branch link attached');
    } catch (error) {
      next(error);
    }
  },
);

PlaneRouter.patch(
  '/:workspace/branch/state',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspace = param(req.params['workspace'], 'workspace');
      const { branch, state: stateName } = req.body as {
        branch: string;
        state: string;
      };

      if (!branch || !stateName) return res.fail('branch and state are required');

      const { projectId, workItem } = await resolveWorkItemFromBranch(workspace, branch);
      const state = await getStateByName(workspace, projectId, stateName);

      const data = await updateWorkItemState(workspace, projectId, workItem.id, state.id);

      res.success(data, `Work item state updated to '${state.name}'`);
    } catch (error) {
      next(error);
    }
  },
);

export default PlaneRouter;
