import { z } from "zod";

//Task
export const TaskStatusEnum = z.enum(["Todo", "Doing", "Done"]);
export type TaskStatus = z.infer<typeof TaskStatusEnum>;

export const PriorityEnum = z.enum(["Low", "Medium", "High"]);
export type Priority = z.infer<typeof PriorityEnum>;

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().default(""),
  priority: PriorityEnum,
  dueDate: z.string().optional(), 
  tags: z.array(z.string()).default([]),
  createdAt: z.string(),
  status: TaskStatusEnum,
});

export type Task = z.infer<typeof TaskSchema>;

export const TaskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().default(""),
  priority: PriorityEnum,
  dueDate: z.string().optional(),
  tags: z.string().default(""), 
});

export type TaskFormValues = z.infer<typeof TaskFormSchema>;

// Login
export const LoginFormSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(false),
});

export type LoginFormValues = z.infer<typeof LoginFormSchema>;

// Activity Log
export type ActivityAction = "created" | "moved" | "edited" | "deleted";

export interface ActivityLogEntry {
  id: string;
  action: ActivityAction;
  taskTitle: string;
  from?: string;
  to?: string;
  timestamp: string; 
}
