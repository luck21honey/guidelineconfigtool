import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export abstract class BaseService<T> {

  protected url = environment.apiUrl;

  constructor(protected endpoint: string) { }

  /**
   *
   * @param parentId: number -> Optionally provide parentId for sub resources
   */
  abstract get(parentId?: number): Observable<T[]>;

  /**
   *
   * @param id: number
   * @param parentId: number -> Optionally provide parentId for sub resources
   */
  abstract getById(id: number, parentId?: number): Observable<T>;

  /**
   *
   * @param queryString: string -> name=NCCN
   * @param parentId: number -> Optionally provide parentId for sub resources
   */
  abstract query(queryString: string, parentId?: number): Observable<T[]>;

  /**
   *
   * @param data: T -> Dto object
   * @param parentId: number -> Optionally provide parentId for sub resources
   */
  abstract create(data: T, parentId?: number): Observable<T>;

  /**
   *
   * @param data: T -> Dto object
   */
  abstract update(data: T): Observable<T>;

  /**
   *
   * @param id: number -> id of resource to delete
   * @param parentId: number -> Optionally provide parentId for sub resources
   */
  abstract delete(id: number, parentId?: number): Observable<any>;
}
