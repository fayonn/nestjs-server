import { IsBoolean } from "class-validator";

export class ApprovedReportDto {
  @IsBoolean()
  isApproved: boolean;
}