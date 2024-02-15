import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {Report} from './report.entity';
import { User } from "../users/user.entity";
import { GetEstimateDto } from "./dtos/get-estimate.dto";

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private readonly reportsRepo: Repository<Report>
  ) {}

  async create(report: Partial<Report>, user: User) {
    const model = this.reportsRepo.create(report);
    model.user = user;
    return await this.reportsRepo.save(model);
  }

  async findOne(id: number) {
    if (!id) return null;
    return await this.reportsRepo.findOneBy({id});
  }

  async update(id: number, attrs: Partial<Report>) {
    const report = await this.findOne(id);
    if (!report) throw new NotFoundException('Report not found');
    Object.assign(report, attrs);
    return await this.reportsRepo.save(report);
  }

  async createEstimate(estimateDto: GetEstimateDto) {
    return this.reportsRepo.createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('mark = :mark', {mark: estimateDto.mark})
      .andWhere('model = :model', {model: estimateDto.model})
      .andWhere('lng - :lng BETWEEN -5 AND 5', {lng: estimateDto.lng})
      .andWhere('lat - :lat BETWEEN -5 AND 5', {lat: estimateDto.lat})
      .andWhere('year - :year BETWEEN -3 AND 3', {year: estimateDto.year})
      .orderBy('mileage - :mileage', 'DESC').setParameters({ mileage: estimateDto.mileage })
      .limit(3)
      .getRawOne();
  }
}
