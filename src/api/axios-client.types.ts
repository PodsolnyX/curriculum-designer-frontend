//-----Types.File-----
export interface CreateCurriculumDto  {
  name: string;
  semesterCount: number;
}
export function deserializeCreateCurriculumDto(json: string): CreateCurriculumDto {
  const data = JSON.parse(json) as CreateCurriculumDto;
  initCreateCurriculumDto(data);
  return data;
}
export function initCreateCurriculumDto(_data: CreateCurriculumDto) {
    return _data;
}
export function serializeCreateCurriculumDto(_data: CreateCurriculumDto | undefined) {
  if (_data) {
    _data = prepareSerializeCreateCurriculumDto(_data as CreateCurriculumDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeCreateCurriculumDto(_data: CreateCurriculumDto): CreateCurriculumDto {
  const data: Record<string, any> = { ..._data };
  return data as CreateCurriculumDto;
}
export interface CurriculumDto  {
  id: number;
  name: string;
  semesters: SemesterDto[];
  atoms: AtomDto[];
  modules: ModuleDto[];
}
export function deserializeCurriculumDto(json: string): CurriculumDto {
  const data = JSON.parse(json) as CurriculumDto;
  initCurriculumDto(data);
  return data;
}
export function initCurriculumDto(_data: CurriculumDto) {
  if (_data) {
    if (Array.isArray(_data["semesters"])) {
      _data.semesters = _data["semesters"].map(item => 
        initSemesterDto(item)
      );
    }
    if (Array.isArray(_data["atoms"])) {
      _data.atoms = _data["atoms"].map(item => 
        initAtomDto(item)
      );
    }
    if (Array.isArray(_data["modules"])) {
      _data.modules = _data["modules"].map(item => 
        initModuleDto(item)
      );
    }
  }
  return _data;
}
export function serializeCurriculumDto(_data: CurriculumDto | undefined) {
  if (_data) {
    _data = prepareSerializeCurriculumDto(_data as CurriculumDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeCurriculumDto(_data: CurriculumDto): CurriculumDto {
  const data: Record<string, any> = { ..._data };
  if (Array.isArray(_data.semesters)) {
    data["semesters"] = _data.semesters.map(item => 
        prepareSerializeSemesterDto(item)
    );
  }
  if (Array.isArray(_data.atoms)) {
    data["atoms"] = _data.atoms.map(item => 
        prepareSerializeAtomDto(item)
    );
  }
  if (Array.isArray(_data.modules)) {
    data["modules"] = _data.modules.map(item => 
        prepareSerializeModuleDto(item)
    );
  }
  return data as CurriculumDto;
}
export interface SemesterDto  {
  id: number;
  curriculumId: number;
  number: number;
  startDate: Date;
  endDate: Date;
}
export function deserializeSemesterDto(json: string): SemesterDto {
  const data = JSON.parse(json) as SemesterDto;
  initSemesterDto(data);
  return data;
}
export function initSemesterDto(_data: SemesterDto) {
  if (_data) {
    _data.startDate = _data["startDate"] ? parseDateOnly(_data["startDate"].toString()) : <any>null;
    _data.endDate = _data["endDate"] ? parseDateOnly(_data["endDate"].toString()) : <any>null;
  }
  return _data;
}
export function serializeSemesterDto(_data: SemesterDto | undefined) {
  if (_data) {
    _data = prepareSerializeSemesterDto(_data as SemesterDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeSemesterDto(_data: SemesterDto): SemesterDto {
  const data: Record<string, any> = { ..._data };
  data["startDate"] = _data.startDate && formatDate(_data.startDate);
  data["endDate"] = _data.endDate && formatDate(_data.endDate);
  return data as SemesterDto;
}
export interface AtomDto  {
  id: number;
  parentModuleId?: number | null;
  name: string;
  isRequired: boolean;
  type: AtomType;
  semesters: RefComponentSemesterDto[];
  competences: CompetenceDto[];
  competenceIndicators: CompetenceIndicatorDto[];
}
export function deserializeAtomDto(json: string): AtomDto {
  const data = JSON.parse(json) as AtomDto;
  initAtomDto(data);
  return data;
}
export function initAtomDto(_data: AtomDto) {
  if (_data) {
    _data.type = _data["type"];
    if (Array.isArray(_data["semesters"])) {
      _data.semesters = _data["semesters"].map(item => 
        initRefComponentSemesterDto(item)
      );
    }
    if (Array.isArray(_data["competences"])) {
      _data.competences = _data["competences"].map(item => 
        initCompetenceDto(item)
      );
    }
    if (Array.isArray(_data["competenceIndicators"])) {
      _data.competenceIndicators = _data["competenceIndicators"].map(item => 
        initCompetenceIndicatorDto(item)
      );
    }
  }
  return _data;
}
export function serializeAtomDto(_data: AtomDto | undefined) {
  if (_data) {
    _data = prepareSerializeAtomDto(_data as AtomDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeAtomDto(_data: AtomDto): AtomDto {
  const data: Record<string, any> = { ..._data };
  if (Array.isArray(_data.semesters)) {
    data["semesters"] = _data.semesters.map(item => 
        prepareSerializeRefComponentSemesterDto(item)
    );
  }
  if (Array.isArray(_data.competences)) {
    data["competences"] = _data.competences.map(item => 
        prepareSerializeCompetenceDto(item)
    );
  }
  if (Array.isArray(_data.competenceIndicators)) {
    data["competenceIndicators"] = _data.competenceIndicators.map(item => 
        prepareSerializeCompetenceIndicatorDto(item)
    );
  }
  return data as AtomDto;
}
export enum AtomType {
    Subject = "Subject",
    Practice = "Practice",
    Attestation = "Attestation",
    Elective = "Elective",
}
export interface RefComponentSemesterDto  {
  semester: SemesterDto;
  credit: number;
  attestations: AttestationDto[];
  academicActivityHours: HoursDistributionDto[];
}
export function deserializeRefComponentSemesterDto(json: string): RefComponentSemesterDto {
  const data = JSON.parse(json) as RefComponentSemesterDto;
  initRefComponentSemesterDto(data);
  return data;
}
export function initRefComponentSemesterDto(_data: RefComponentSemesterDto) {
  if (_data) {
    _data.semester = _data["semester"] && initSemesterDto(_data["semester"]);
    if (Array.isArray(_data["attestations"])) {
      _data.attestations = _data["attestations"].map(item => 
        initAttestationDto(item)
      );
    }
    if (Array.isArray(_data["academicActivityHours"])) {
      _data.academicActivityHours = _data["academicActivityHours"].map(item => 
        initHoursDistributionDto(item)
      );
    }
  }
  return _data;
}
export function serializeRefComponentSemesterDto(_data: RefComponentSemesterDto | undefined) {
  if (_data) {
    _data = prepareSerializeRefComponentSemesterDto(_data as RefComponentSemesterDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeRefComponentSemesterDto(_data: RefComponentSemesterDto): RefComponentSemesterDto {
  const data: Record<string, any> = { ..._data };
  data["semester"] = _data.semester && prepareSerializeSemesterDto(_data.semester);
  if (Array.isArray(_data.attestations)) {
    data["attestations"] = _data.attestations.map(item => 
        prepareSerializeAttestationDto(item)
    );
  }
  if (Array.isArray(_data.academicActivityHours)) {
    data["academicActivityHours"] = _data.academicActivityHours.map(item => 
        prepareSerializeHoursDistributionDto(item)
    );
  }
  return data as RefComponentSemesterDto;
}
export interface AttestationDto  {
  id: number;
  name: string;
  shortName: string;
}
export function deserializeAttestationDto(json: string): AttestationDto {
  const data = JSON.parse(json) as AttestationDto;
  initAttestationDto(data);
  return data;
}
export function initAttestationDto(_data: AttestationDto) {
    return _data;
}
export function serializeAttestationDto(_data: AttestationDto | undefined) {
  if (_data) {
    _data = prepareSerializeAttestationDto(_data as AttestationDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeAttestationDto(_data: AttestationDto): AttestationDto {
  const data: Record<string, any> = { ..._data };
  return data as AttestationDto;
}
export interface HoursDistributionDto  {
  academicActivity: AcademicActivityDto;
  value: number;
}
export function deserializeHoursDistributionDto(json: string): HoursDistributionDto {
  const data = JSON.parse(json) as HoursDistributionDto;
  initHoursDistributionDto(data);
  return data;
}
export function initHoursDistributionDto(_data: HoursDistributionDto) {
  if (_data) {
    _data.academicActivity = _data["academicActivity"] && initAcademicActivityDto(_data["academicActivity"]);
  }
  return _data;
}
export function serializeHoursDistributionDto(_data: HoursDistributionDto | undefined) {
  if (_data) {
    _data = prepareSerializeHoursDistributionDto(_data as HoursDistributionDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeHoursDistributionDto(_data: HoursDistributionDto): HoursDistributionDto {
  const data: Record<string, any> = { ..._data };
  data["academicActivity"] = _data.academicActivity && prepareSerializeAcademicActivityDto(_data.academicActivity);
  return data as HoursDistributionDto;
}
export interface AcademicActivityDto  {
  id: number;
  name: string;
  shortName: string;
}
export function deserializeAcademicActivityDto(json: string): AcademicActivityDto {
  const data = JSON.parse(json) as AcademicActivityDto;
  initAcademicActivityDto(data);
  return data;
}
export function initAcademicActivityDto(_data: AcademicActivityDto) {
    return _data;
}
export function serializeAcademicActivityDto(_data: AcademicActivityDto | undefined) {
  if (_data) {
    _data = prepareSerializeAcademicActivityDto(_data as AcademicActivityDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeAcademicActivityDto(_data: AcademicActivityDto): AcademicActivityDto {
  const data: Record<string, any> = { ..._data };
  return data as AcademicActivityDto;
}
export interface CompetenceDto  {
  id: number;
  index: string;
  name: string;
  type: CompetenceType;
  indicators: CompetenceIndicatorDto[];
}
export function deserializeCompetenceDto(json: string): CompetenceDto {
  const data = JSON.parse(json) as CompetenceDto;
  initCompetenceDto(data);
  return data;
}
export function initCompetenceDto(_data: CompetenceDto) {
  if (_data) {
    _data.type = _data["type"];
    if (Array.isArray(_data["indicators"])) {
      _data.indicators = _data["indicators"].map(item => 
        initCompetenceIndicatorDto(item)
      );
    }
  }
  return _data;
}
export function serializeCompetenceDto(_data: CompetenceDto | undefined) {
  if (_data) {
    _data = prepareSerializeCompetenceDto(_data as CompetenceDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeCompetenceDto(_data: CompetenceDto): CompetenceDto {
  const data: Record<string, any> = { ..._data };
  if (Array.isArray(_data.indicators)) {
    data["indicators"] = _data.indicators.map(item => 
        prepareSerializeCompetenceIndicatorDto(item)
    );
  }
  return data as CompetenceDto;
}
export enum CompetenceType {
    Basic = "Basic",
    Universal = "Universal",
    GeneralProfessional = "GeneralProfessional",
    Professional = "Professional",
}
export interface CompetenceIndicatorDto  {
  id: number;
  index: string;
  name: string;
}
export function deserializeCompetenceIndicatorDto(json: string): CompetenceIndicatorDto {
  const data = JSON.parse(json) as CompetenceIndicatorDto;
  initCompetenceIndicatorDto(data);
  return data;
}
export function initCompetenceIndicatorDto(_data: CompetenceIndicatorDto) {
    return _data;
}
export function serializeCompetenceIndicatorDto(_data: CompetenceIndicatorDto | undefined) {
  if (_data) {
    _data = prepareSerializeCompetenceIndicatorDto(_data as CompetenceIndicatorDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeCompetenceIndicatorDto(_data: CompetenceIndicatorDto): CompetenceIndicatorDto {
  const data: Record<string, any> = { ..._data };
  return data as CompetenceIndicatorDto;
}
export interface ModuleDto  {
  id: number;
  parentModuleId?: number | null;
  name: string;
  atoms: AtomDto[];
  modules: ModuleDto[];
  selection?: SelectionDto | null;
  semesterIds: number[];
}
export function deserializeModuleDto(json: string): ModuleDto {
  const data = JSON.parse(json) as ModuleDto;
  initModuleDto(data);
  return data;
}
export function initModuleDto(_data: ModuleDto) {
  if (_data) {
    if (Array.isArray(_data["atoms"])) {
      _data.atoms = _data["atoms"].map(item => 
        initAtomDto(item)
      );
    }
    if (Array.isArray(_data["modules"])) {
      _data.modules = _data["modules"].map(item => 
        initModuleDto(item)
      );
    }
    _data.selection = _data["selection"] && initSelectionDto(_data["selection"]);
    _data.semesterIds = _data["semesterIds"];
  }
  return _data;
}
export function serializeModuleDto(_data: ModuleDto | undefined) {
  if (_data) {
    _data = prepareSerializeModuleDto(_data as ModuleDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeModuleDto(_data: ModuleDto): ModuleDto {
  const data: Record<string, any> = { ..._data };
  if (Array.isArray(_data.atoms)) {
    data["atoms"] = _data.atoms.map(item => 
        prepareSerializeAtomDto(item)
    );
  }
  if (Array.isArray(_data.modules)) {
    data["modules"] = _data.modules.map(item => 
        prepareSerializeModuleDto(item)
    );
  }
  data["selection"] = _data.selection && prepareSerializeSelectionDto(_data.selection);
  return data as ModuleDto;
}
export interface SelectionDto  {
  name: string;
  creditPerSemester: number[];
}
export function deserializeSelectionDto(json: string): SelectionDto {
  const data = JSON.parse(json) as SelectionDto;
  initSelectionDto(data);
  return data;
}
export function initSelectionDto(_data: SelectionDto) {
  if (_data) {
    _data.creditPerSemester = _data["creditPerSemester"];
  }
  return _data;
}
export function serializeSelectionDto(_data: SelectionDto | undefined) {
  if (_data) {
    _data = prepareSerializeSelectionDto(_data as SelectionDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeSelectionDto(_data: SelectionDto): SelectionDto {
  const data: Record<string, any> = { ..._data };
  return data as SelectionDto;
}
export interface CurriculumShortDto  {
  id: number;
  name: string;
}
export function deserializeCurriculumShortDto(json: string): CurriculumShortDto {
  const data = JSON.parse(json) as CurriculumShortDto;
  initCurriculumShortDto(data);
  return data;
}
export function initCurriculumShortDto(_data: CurriculumShortDto) {
    return _data;
}
export function serializeCurriculumShortDto(_data: CurriculumShortDto | undefined) {
  if (_data) {
    _data = prepareSerializeCurriculumShortDto(_data as CurriculumShortDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeCurriculumShortDto(_data: CurriculumShortDto): CurriculumShortDto {
  const data: Record<string, any> = { ..._data };
  return data as CurriculumShortDto;
}
export interface CreateCompetenceDto  {
  name: string;
  type: CompetenceType;
}
export function deserializeCreateCompetenceDto(json: string): CreateCompetenceDto {
  const data = JSON.parse(json) as CreateCompetenceDto;
  initCreateCompetenceDto(data);
  return data;
}
export function initCreateCompetenceDto(_data: CreateCompetenceDto) {
  if (_data) {
    _data.type = _data["type"];
  }
  return _data;
}
export function serializeCreateCompetenceDto(_data: CreateCompetenceDto | undefined) {
  if (_data) {
    _data = prepareSerializeCreateCompetenceDto(_data as CreateCompetenceDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeCreateCompetenceDto(_data: CreateCompetenceDto): CreateCompetenceDto {
  const data: Record<string, any> = { ..._data };
  return data as CreateCompetenceDto;
}
export interface UpdateCompetenceDto  {
  name?: string | null;
  type?: CompetenceType | null;
  order?: number | null;
}
export function deserializeUpdateCompetenceDto(json: string): UpdateCompetenceDto {
  const data = JSON.parse(json) as UpdateCompetenceDto;
  initUpdateCompetenceDto(data);
  return data;
}
export function initUpdateCompetenceDto(_data: UpdateCompetenceDto) {
  if (_data) {
    _data.type = _data["type"];
  }
  return _data;
}
export function serializeUpdateCompetenceDto(_data: UpdateCompetenceDto | undefined) {
  if (_data) {
    _data = prepareSerializeUpdateCompetenceDto(_data as UpdateCompetenceDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeUpdateCompetenceDto(_data: UpdateCompetenceDto): UpdateCompetenceDto {
  const data: Record<string, any> = { ..._data };
  return data as UpdateCompetenceDto;
}
export interface CreateCompetenceIndicatorDto  {
  name: string;
}
export function deserializeCreateCompetenceIndicatorDto(json: string): CreateCompetenceIndicatorDto {
  const data = JSON.parse(json) as CreateCompetenceIndicatorDto;
  initCreateCompetenceIndicatorDto(data);
  return data;
}
export function initCreateCompetenceIndicatorDto(_data: CreateCompetenceIndicatorDto) {
    return _data;
}
export function serializeCreateCompetenceIndicatorDto(_data: CreateCompetenceIndicatorDto | undefined) {
  if (_data) {
    _data = prepareSerializeCreateCompetenceIndicatorDto(_data as CreateCompetenceIndicatorDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeCreateCompetenceIndicatorDto(_data: CreateCompetenceIndicatorDto): CreateCompetenceIndicatorDto {
  const data: Record<string, any> = { ..._data };
  return data as CreateCompetenceIndicatorDto;
}
export interface UpdateCompetenceIndicatorDto  {
  name?: string | null;
  order?: number | null;
}
export function deserializeUpdateCompetenceIndicatorDto(json: string): UpdateCompetenceIndicatorDto {
  const data = JSON.parse(json) as UpdateCompetenceIndicatorDto;
  initUpdateCompetenceIndicatorDto(data);
  return data;
}
export function initUpdateCompetenceIndicatorDto(_data: UpdateCompetenceIndicatorDto) {
    return _data;
}
export function serializeUpdateCompetenceIndicatorDto(_data: UpdateCompetenceIndicatorDto | undefined) {
  if (_data) {
    _data = prepareSerializeUpdateCompetenceIndicatorDto(_data as UpdateCompetenceIndicatorDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeUpdateCompetenceIndicatorDto(_data: UpdateCompetenceIndicatorDto): UpdateCompetenceIndicatorDto {
  const data: Record<string, any> = { ..._data };
  return data as UpdateCompetenceIndicatorDto;
}
export function formatDate(d: Date) {
    return d.getFullYear() + '-' + 
        (d.getMonth() < 9 ? ('0' + (d.getMonth()+1)) : (d.getMonth()+1)) + '-' +
        (d.getDate() < 10 ? ('0' + d.getDate()) : d.getDate());
}
export function parseDateOnly(s: string) {
    const date = new Date(s);
    return new Date(date.getTime() + 
        date.getTimezoneOffset() * 60000);
}
import type { AxiosError } from 'axios'
export interface FileParameter {
    data: any;
    fileName: string;
}
export class ApiException extends Error {
    message: string;
    status: number;
    response: string;
    headers: { [key: string]: any; };
    result: any;
    constructor(message: string, status: number, response: string, headers: { [key: string]: any; }, result: any) {
        super();
        this.message = message;
        this.status = status;
        this.response = response;
        this.headers = headers;
        this.result = result;
    }
    protected isApiException = true;
    static isApiException(obj: any): obj is ApiException {
        return obj.isApiException === true;
    }
}
export function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): any {
    if (result !== null && result !== undefined)
        throw result;
    else
        throw new ApiException(message, status, response, headers, null);
}
export function isAxiosError(obj: any | undefined): obj is AxiosError {
    return obj && obj.isAxiosError === true;
}
//-----/Types.File-----