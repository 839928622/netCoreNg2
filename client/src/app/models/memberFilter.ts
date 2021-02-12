import { BasePagination } from './BasePagination';

export class MemberFilter extends BasePagination{
  gender: string;
  minAge = 18;
  maxAge = 90;
  orderBy = 'lastActive';
}
