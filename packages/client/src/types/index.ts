export interface IEError {
  response: { data: { reason: string } };
}
export { TRoutes } from "./routes";
export {
  loginSchema,
  registerSchema,
  newForumThemeSchema,
  newForumMsgSchema,
  editPassSchema,
  formProfileSchema,
} from "./forms";
