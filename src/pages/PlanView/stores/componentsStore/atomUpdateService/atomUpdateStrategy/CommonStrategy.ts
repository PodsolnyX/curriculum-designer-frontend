import { AtomDto, UpdateAtomDto } from '@/api/axios-client.types.ts';
import { BaseAtomStrategy } from '@/pages/PlanView/stores/componentsStore/atomUpdateService/atomUpdateStrategy/AtomUpdateStrategy.ts';
import { Client as AtomClient } from '@/api/axios-client/AtomQuery.ts';

export class CommonStrategy extends BaseAtomStrategy {
  private validKeys = ['name', 'type', 'isRequired', 'department'] as const;

  updateLocal(atom: AtomDto, _semesterId: number, param: any, key?: string) {
    if (!key || !this.validKeys.includes(key as any)) return;
    (atom as any)[key] = param;
  }

  async updateRemote(
    atomId: number,
    _semesterId: number,
    param: any,
    key?: string,
  ) {
    if (!key || !this.validKeys.includes(key as any)) return;
    await AtomClient.updateAtom(atomId, { [key]: param } as UpdateAtomDto);
    this.invalidateAndNotify();
  }
}
