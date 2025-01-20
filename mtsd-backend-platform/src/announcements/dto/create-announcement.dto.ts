export class CreateAnnouncementDto {
  title: string;
  content: string;
  isUrgent: boolean;
  courseId?: number;
}
