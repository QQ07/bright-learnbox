
export const saveTaskId = (taskId: string) => {
  localStorage.setItem('pdf_task_id', taskId);
};

export const getTaskId = () => {
  return localStorage.getItem('pdf_task_id');
};

export const clearTaskId = () => {
  localStorage.removeItem('pdf_task_id');
};
