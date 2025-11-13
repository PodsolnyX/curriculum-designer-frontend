import { AtomDto } from "@/api/axios-client.types.ts";
import { message } from "antd";
import { queryClient } from "@/shared/lib/api/queryClient.tsx";
import { getValidationErrorsQueryKey } from "@/api/axios-client/ValidationQuery.ts";
import { getSemestersQueryKey } from "@/api/axios-client/SemestersQuery.ts";
import { commonStore } from "@/pages/PlanView/lib/stores/commonStore.ts";
import { ATOM_SUCCESS_UPDATE_MESSAGE } from "@/shared/const/messages.ts";

export interface AtomUpdateStrategy {
  updateLocal(atom: AtomDto, semesterId: number, param: any, paramKey?: string): void;
  updateRemote(atomId: number, semesterId: number, param: any, paramKey?: string): Promise<void>;
}

export abstract class BaseAtomStrategy implements AtomUpdateStrategy {
  abstract updateLocal(atom: AtomDto, semesterId: number, param: any, paramKey?: string): void;
  abstract updateRemote(atomId: number, semesterId: number, param: any, paramKey?: string): Promise<void>;

  protected invalidateAndNotify() {
    queryClient.invalidateQueries({ queryKey: getSemestersQueryKey(commonStore.curriculumData?.id || 0) });
    queryClient.invalidateQueries({ queryKey: getValidationErrorsQueryKey(commonStore.curriculumData?.id || 0) });
    message.success(ATOM_SUCCESS_UPDATE_MESSAGE);
  }
}