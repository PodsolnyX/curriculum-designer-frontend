//-----Types.File-----
/** Represents a validation error. */
export interface ValidationError  {
  /** Identifier of the validator that generated the error. */
  validatorId: number;
  /** Validation level of the error. */
  level: ValidationLevel;
  /** Message of the validation error. */
  message: string;
  /** Entities associated with the validation error. */
  entities?: ValidationErrorEntity[];
}
export function deserializeValidationError(json: string): ValidationError {
  const data = JSON.parse(json) as ValidationError;
  initValidationError(data);
  return data;
}
export function initValidationError(_data: ValidationError) {
  if (_data) {
    _data.level = _data["level"];
    if (Array.isArray(_data["entities"])) {
      _data.entities = _data["entities"].map(item => 
        initValidationErrorEntity(item)
      );
    }
  }
  return _data;
}
export function serializeValidationError(_data: ValidationError | undefined) {
  if (_data) {
    _data = prepareSerializeValidationError(_data as ValidationError);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeValidationError(_data: ValidationError): ValidationError {
  const data: Record<string, any> = { ..._data };
  if (Array.isArray(_data.entities)) {
    data["entities"] = _data.entities.map(item => 
        prepareSerializeValidationErrorEntity(item)
    );
  }
  return data as ValidationError;
}
export enum ValidationLevel {
    Information = "Information",
    Warning = "Warning",
    Error = "Error",
}
/** Represents an entity associated with a validation error. */
export interface ValidationErrorEntity  {
  /** Entity type. */
  type: string;
  /** Entity identifier. */
  id: number;
}
export function deserializeValidationErrorEntity(json: string): ValidationErrorEntity {
  const data = JSON.parse(json) as ValidationErrorEntity;
  initValidationErrorEntity(data);
  return data;
}
export function initValidationErrorEntity(_data: ValidationErrorEntity) {
    return _data;
}
export function serializeValidationErrorEntity(_data: ValidationErrorEntity | undefined) {
  if (_data) {
    _data = prepareSerializeValidationErrorEntity(_data as ValidationErrorEntity);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeValidationErrorEntity(_data: ValidationErrorEntity): ValidationErrorEntity {
  const data: Record<string, any> = { ..._data };
  return data as ValidationErrorEntity;
}
export interface ValidatorsDto  {
  customValidators: CustomValidatorDto[];
  structuralValidators: StructuralValidatorDto[];
}
export function deserializeValidatorsDto(json: string): ValidatorsDto {
  const data = JSON.parse(json) as ValidatorsDto;
  initValidatorsDto(data);
  return data;
}
export function initValidatorsDto(_data: ValidatorsDto) {
  if (_data) {
    if (Array.isArray(_data["customValidators"])) {
      _data.customValidators = _data["customValidators"].map(item => 
        initCustomValidatorDto(item)
      );
    }
    if (Array.isArray(_data["structuralValidators"])) {
      _data.structuralValidators = _data["structuralValidators"].map(item => 
        initStructuralValidatorDto(item)
      );
    }
  }
  return _data;
}
export function serializeValidatorsDto(_data: ValidatorsDto | undefined) {
  if (_data) {
    _data = prepareSerializeValidatorsDto(_data as ValidatorsDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeValidatorsDto(_data: ValidatorsDto): ValidatorsDto {
  const data: Record<string, any> = { ..._data };
  if (Array.isArray(_data.customValidators)) {
    data["customValidators"] = _data.customValidators.map(item => 
        prepareSerializeCustomValidatorDto(item)
    );
  }
  if (Array.isArray(_data.structuralValidators)) {
    data["structuralValidators"] = _data.structuralValidators.map(item => 
        prepareSerializeStructuralValidatorDto(item)
    );
  }
  return data as ValidatorsDto;
}
export interface ValidatorDto  {
  id: number;
  name: string;
  isEnabled: boolean;
  level: ValidationLevel;
}
export function deserializeValidatorDto(json: string): ValidatorDto {
  const data = JSON.parse(json) as ValidatorDto;
  initValidatorDto(data);
  return data;
}
export function initValidatorDto(_data: ValidatorDto) {
  if (_data) {
    _data.level = _data["level"];
  }
  return _data;
}
export function serializeValidatorDto(_data: ValidatorDto | undefined) {
  if (_data) {
    _data = prepareSerializeValidatorDto(_data as ValidatorDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeValidatorDto(_data: ValidatorDto): ValidatorDto {
  const data: Record<string, any> = { ..._data };
  return data as ValidatorDto;
}
export interface CustomValidatorDto extends ValidatorDto  {
  iterationType: ValidatorIterationType;
  filterFormula: string;
  validationFormula: string;
  messagePattern: string;
}
export function deserializeCustomValidatorDto(json: string): CustomValidatorDto {
  const data = JSON.parse(json) as CustomValidatorDto;
  initCustomValidatorDto(data);
  return data;
}
export function initCustomValidatorDto(_data: CustomValidatorDto) {
  initValidatorDto(_data);
  if (_data) {
    _data.iterationType = _data["iterationType"];
  }
  return _data;
}
export function serializeCustomValidatorDto(_data: CustomValidatorDto | undefined) {
  if (_data) {
    _data = prepareSerializeCustomValidatorDto(_data as CustomValidatorDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeCustomValidatorDto(_data: CustomValidatorDto): CustomValidatorDto {
  const data = prepareSerializeValidatorDto(_data as CustomValidatorDto) as Record<string, any>;
  return data as CustomValidatorDto;
}
export enum ValidatorIterationType {
    Atom = "Atom",
    AtomSemester = "AtomSemester",
    Competence = "Competence",
    Semester = "Semester",
}
export interface StructuralValidatorDto extends ValidatorDto  {
  typeName: string;
}
export function deserializeStructuralValidatorDto(json: string): StructuralValidatorDto {
  const data = JSON.parse(json) as StructuralValidatorDto;
  initStructuralValidatorDto(data);
  return data;
}
export function initStructuralValidatorDto(_data: StructuralValidatorDto) {
  initValidatorDto(_data);
    return _data;
}
export function serializeStructuralValidatorDto(_data: StructuralValidatorDto | undefined) {
  if (_data) {
    _data = prepareSerializeStructuralValidatorDto(_data as StructuralValidatorDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeStructuralValidatorDto(_data: StructuralValidatorDto): StructuralValidatorDto {
  const data = prepareSerializeValidatorDto(_data as StructuralValidatorDto) as Record<string, any>;
  return data as StructuralValidatorDto;
}
export interface CreateCustomValidatorDto  {
  name: string;
  isEnabled: boolean;
  level: ValidationLevel;
  iterationType: ValidatorIterationType;
  filterFormula: string;
  validationFormula: string;
  messagePattern: string;
}
export function deserializeCreateCustomValidatorDto(json: string): CreateCustomValidatorDto {
  const data = JSON.parse(json) as CreateCustomValidatorDto;
  initCreateCustomValidatorDto(data);
  return data;
}
export function initCreateCustomValidatorDto(_data: CreateCustomValidatorDto) {
  if (_data) {
    _data.level = _data["level"];
    _data.iterationType = _data["iterationType"];
  }
  return _data;
}
export function serializeCreateCustomValidatorDto(_data: CreateCustomValidatorDto | undefined) {
  if (_data) {
    _data = prepareSerializeCreateCustomValidatorDto(_data as CreateCustomValidatorDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeCreateCustomValidatorDto(_data: CreateCustomValidatorDto): CreateCustomValidatorDto {
  const data: Record<string, any> = { ..._data };
  return data as CreateCustomValidatorDto;
}
export interface UpdateCustomValidatorDto  {
  name?: string;
  isEnabled?: boolean;
  level?: ValidationLevel;
  iterationType?: ValidatorIterationType;
  filterFormula?: string;
  validationFormula?: string;
  messagePattern?: string;
}
export function deserializeUpdateCustomValidatorDto(json: string): UpdateCustomValidatorDto {
  const data = JSON.parse(json) as UpdateCustomValidatorDto;
  initUpdateCustomValidatorDto(data);
  return data;
}
export function initUpdateCustomValidatorDto(_data: UpdateCustomValidatorDto) {
  if (_data) {
    _data.level = _data["level"];
    _data.iterationType = _data["iterationType"];
  }
  return _data;
}
export function serializeUpdateCustomValidatorDto(_data: UpdateCustomValidatorDto | undefined) {
  if (_data) {
    _data = prepareSerializeUpdateCustomValidatorDto(_data as UpdateCustomValidatorDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeUpdateCustomValidatorDto(_data: UpdateCustomValidatorDto): UpdateCustomValidatorDto {
  const data: Record<string, any> = { ..._data };
  return data as UpdateCustomValidatorDto;
}
export interface UpdateStructuralValidatorDto  {
  name?: string;
  isEnabled?: boolean;
  level?: ValidationLevel;
}
export function deserializeUpdateStructuralValidatorDto(json: string): UpdateStructuralValidatorDto {
  const data = JSON.parse(json) as UpdateStructuralValidatorDto;
  initUpdateStructuralValidatorDto(data);
  return data;
}
export function initUpdateStructuralValidatorDto(_data: UpdateStructuralValidatorDto) {
  if (_data) {
    _data.level = _data["level"];
  }
  return _data;
}
export function serializeUpdateStructuralValidatorDto(_data: UpdateStructuralValidatorDto | undefined) {
  if (_data) {
    _data = prepareSerializeUpdateStructuralValidatorDto(_data as UpdateStructuralValidatorDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeUpdateStructuralValidatorDto(_data: UpdateStructuralValidatorDto): UpdateStructuralValidatorDto {
  const data: Record<string, any> = { ..._data };
  return data as UpdateStructuralValidatorDto;
}
export interface RefModuleSemesterDto  {
  semester: SemesterDto;
  nonElective: ComponentSemesterDto;
  elective: ComponentSemesterDto;
}
export function deserializeRefModuleSemesterDto(json: string): RefModuleSemesterDto {
  const data = JSON.parse(json) as RefModuleSemesterDto;
  initRefModuleSemesterDto(data);
  return data;
}
export function initRefModuleSemesterDto(_data: RefModuleSemesterDto) {
  if (_data) {
    _data.semester = _data["semester"] && initSemesterDto(_data["semester"]);
    _data.nonElective = _data["nonElective"] && initComponentSemesterDto(_data["nonElective"]);
    _data.elective = _data["elective"] && initComponentSemesterDto(_data["elective"]);
  }
  return _data;
}
export function serializeRefModuleSemesterDto(_data: RefModuleSemesterDto | undefined) {
  if (_data) {
    _data = prepareSerializeRefModuleSemesterDto(_data as RefModuleSemesterDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeRefModuleSemesterDto(_data: RefModuleSemesterDto): RefModuleSemesterDto {
  const data: Record<string, any> = { ..._data };
  data["semester"] = _data.semester && prepareSerializeSemesterDto(_data.semester);
  data["nonElective"] = _data.nonElective && prepareSerializeComponentSemesterDto(_data.nonElective);
  data["elective"] = _data.elective && prepareSerializeComponentSemesterDto(_data.elective);
  return data as RefModuleSemesterDto;
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
export interface ComponentSemesterDto  {
  credit: number;
  attestations: AttestationDto[];
  academicActivityHours: HoursDistributionDto[];
}
export function deserializeComponentSemesterDto(json: string): ComponentSemesterDto {
  const data = JSON.parse(json) as ComponentSemesterDto;
  initComponentSemesterDto(data);
  return data;
}
export function initComponentSemesterDto(_data: ComponentSemesterDto) {
  if (_data) {
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
export function serializeComponentSemesterDto(_data: ComponentSemesterDto | undefined) {
  if (_data) {
    _data = prepareSerializeComponentSemesterDto(_data as ComponentSemesterDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeComponentSemesterDto(_data: ComponentSemesterDto): ComponentSemesterDto {
  const data: Record<string, any> = { ..._data };
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
  return data as ComponentSemesterDto;
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
  isCalculated: boolean;
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
  isCountable: boolean;
  isIncludedInDocumentation: boolean;
  formula?: string | null;
  formulaName?: string;
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
export enum TableType {
    Summary = "Summary",
    Competences = "Competences",
    CompetenceDistribution = "CompetenceDistribution",
}
export interface DepartmentDto  {
  id: number;
  name: string;
}
export function deserializeDepartmentDto(json: string): DepartmentDto {
  const data = JSON.parse(json) as DepartmentDto;
  initDepartmentDto(data);
  return data;
}
export function initDepartmentDto(_data: DepartmentDto) {
    return _data;
}
export function serializeDepartmentDto(_data: DepartmentDto | undefined) {
  if (_data) {
    _data = prepareSerializeDepartmentDto(_data as DepartmentDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeDepartmentDto(_data: DepartmentDto): DepartmentDto {
  const data: Record<string, any> = { ..._data };
  return data as DepartmentDto;
}
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
  settings: CurriculumSettingsDto;
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
    _data.settings = _data["settings"] && initCurriculumSettingsDto(_data["settings"]);
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
  data["settings"] = _data.settings && prepareSerializeCurriculumSettingsDto(_data.settings);
  return data as CurriculumDto;
}
export interface CurriculumSettingsDto  {
  competenceDistributionType: CompetenceDistributionType;
  hoursPerCredit: number;
}
export function deserializeCurriculumSettingsDto(json: string): CurriculumSettingsDto {
  const data = JSON.parse(json) as CurriculumSettingsDto;
  initCurriculumSettingsDto(data);
  return data;
}
export function initCurriculumSettingsDto(_data: CurriculumSettingsDto) {
  if (_data) {
    _data.competenceDistributionType = _data["competenceDistributionType"];
  }
  return _data;
}
export function serializeCurriculumSettingsDto(_data: CurriculumSettingsDto | undefined) {
  if (_data) {
    _data = prepareSerializeCurriculumSettingsDto(_data as CurriculumSettingsDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeCurriculumSettingsDto(_data: CurriculumSettingsDto): CurriculumSettingsDto {
  const data: Record<string, any> = { ..._data };
  return data as CurriculumSettingsDto;
}
export enum CompetenceDistributionType {
    Competence = "Competence",
    CompetenceIndicator = "CompetenceIndicator",
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
export interface SetCurriculumSettingsDto  {
  competenceDistributionType: CompetenceDistributionType;
  hoursPerCredit: number;
}
export function deserializeSetCurriculumSettingsDto(json: string): SetCurriculumSettingsDto {
  const data = JSON.parse(json) as SetCurriculumSettingsDto;
  initSetCurriculumSettingsDto(data);
  return data;
}
export function initSetCurriculumSettingsDto(_data: SetCurriculumSettingsDto) {
  if (_data) {
    _data.competenceDistributionType = _data["competenceDistributionType"];
  }
  return _data;
}
export function serializeSetCurriculumSettingsDto(_data: SetCurriculumSettingsDto | undefined) {
  if (_data) {
    _data = prepareSerializeSetCurriculumSettingsDto(_data as SetCurriculumSettingsDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeSetCurriculumSettingsDto(_data: SetCurriculumSettingsDto): SetCurriculumSettingsDto {
  const data: Record<string, any> = { ..._data };
  return data as SetCurriculumSettingsDto;
}
export interface SelectionDto  {
  semesters: CreditPerSemesterDto[];
}
export function deserializeSelectionDto(json: string): SelectionDto {
  const data = JSON.parse(json) as SelectionDto;
  initSelectionDto(data);
  return data;
}
export function initSelectionDto(_data: SelectionDto) {
  if (_data) {
    if (Array.isArray(_data["semesters"])) {
      _data.semesters = _data["semesters"].map(item => 
        initCreditPerSemesterDto(item)
      );
    }
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
  if (Array.isArray(_data.semesters)) {
    data["semesters"] = _data.semesters.map(item => 
        prepareSerializeCreditPerSemesterDto(item)
    );
  }
  return data as SelectionDto;
}
export interface CreditPerSemesterDto  {
  semesterId: number;
  credit: number;
}
export function deserializeCreditPerSemesterDto(json: string): CreditPerSemesterDto {
  const data = JSON.parse(json) as CreditPerSemesterDto;
  initCreditPerSemesterDto(data);
  return data;
}
export function initCreditPerSemesterDto(_data: CreditPerSemesterDto) {
    return _data;
}
export function serializeCreditPerSemesterDto(_data: CreditPerSemesterDto | undefined) {
  if (_data) {
    _data = prepareSerializeCreditPerSemesterDto(_data as CreditPerSemesterDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeCreditPerSemesterDto(_data: CreditPerSemesterDto): CreditPerSemesterDto {
  const data: Record<string, any> = { ..._data };
  return data as CreditPerSemesterDto;
}
export interface CreateUpdateSelectionDto  {
  name?: string | null;
  semesters?: CreditPerSemesterDto[] | null;
}
export function deserializeCreateUpdateSelectionDto(json: string): CreateUpdateSelectionDto {
  const data = JSON.parse(json) as CreateUpdateSelectionDto;
  initCreateUpdateSelectionDto(data);
  return data;
}
export function initCreateUpdateSelectionDto(_data: CreateUpdateSelectionDto) {
  if (_data) {
    if (Array.isArray(_data["semesters"])) {
      _data.semesters = _data["semesters"].map(item => 
        initCreditPerSemesterDto(item)
      );
    }
  }
  return _data;
}
export function serializeCreateUpdateSelectionDto(_data: CreateUpdateSelectionDto | undefined) {
  if (_data) {
    _data = prepareSerializeCreateUpdateSelectionDto(_data as CreateUpdateSelectionDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeCreateUpdateSelectionDto(_data: CreateUpdateSelectionDto): CreateUpdateSelectionDto {
  const data: Record<string, any> = { ..._data };
  if (Array.isArray(_data.semesters)) {
    data["semesters"] = _data.semesters.map(item => 
        prepareSerializeCreditPerSemesterDto(item)
    );
  }
  return data as CreateUpdateSelectionDto;
}
export interface TupleOfIntegerAndString  {
  item1?: number;
  item2?: string | null;
}
export function deserializeTupleOfIntegerAndString(json: string): TupleOfIntegerAndString {
  const data = JSON.parse(json) as TupleOfIntegerAndString;
  initTupleOfIntegerAndString(data);
  return data;
}
export function initTupleOfIntegerAndString(_data: TupleOfIntegerAndString) {
    return _data;
}
export function serializeTupleOfIntegerAndString(_data: TupleOfIntegerAndString | undefined) {
  if (_data) {
    _data = prepareSerializeTupleOfIntegerAndString(_data as TupleOfIntegerAndString);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeTupleOfIntegerAndString(_data: TupleOfIntegerAndString): TupleOfIntegerAndString {
  const data: Record<string, any> = { ..._data };
  return data as TupleOfIntegerAndString;
}
export interface CreateModuleDto  {
  curriculumId: number;
  parentModuleId?: number | null;
  parentSemesterId: number;
  order?: number | null;
  name: string;
}
export function deserializeCreateModuleDto(json: string): CreateModuleDto {
  const data = JSON.parse(json) as CreateModuleDto;
  initCreateModuleDto(data);
  return data;
}
export function initCreateModuleDto(_data: CreateModuleDto) {
    return _data;
}
export function serializeCreateModuleDto(_data: CreateModuleDto | undefined) {
  if (_data) {
    _data = prepareSerializeCreateModuleDto(_data as CreateModuleDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeCreateModuleDto(_data: CreateModuleDto): CreateModuleDto {
  const data: Record<string, any> = { ..._data };
  return data as CreateModuleDto;
}
export interface CreateModuleWithSelectionDto  {
  module?: CreateModuleDto;
  selection?: CreateUpdateSelectionDto;
}
export function deserializeCreateModuleWithSelectionDto(json: string): CreateModuleWithSelectionDto {
  const data = JSON.parse(json) as CreateModuleWithSelectionDto;
  initCreateModuleWithSelectionDto(data);
  return data;
}
export function initCreateModuleWithSelectionDto(_data: CreateModuleWithSelectionDto) {
  if (_data) {
    _data.module = _data["module"] && initCreateModuleDto(_data["module"]);
    _data.selection = _data["selection"] && initCreateUpdateSelectionDto(_data["selection"]);
  }
  return _data;
}
export function serializeCreateModuleWithSelectionDto(_data: CreateModuleWithSelectionDto | undefined) {
  if (_data) {
    _data = prepareSerializeCreateModuleWithSelectionDto(_data as CreateModuleWithSelectionDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeCreateModuleWithSelectionDto(_data: CreateModuleWithSelectionDto): CreateModuleWithSelectionDto {
  const data: Record<string, any> = { ..._data };
  data["module"] = _data.module && prepareSerializeCreateModuleDto(_data.module);
  data["selection"] = _data.selection && prepareSerializeCreateUpdateSelectionDto(_data.selection);
  return data as CreateModuleWithSelectionDto;
}
/** Represents a module tree. Iterating over this object will yield all modules from the leafs to the root. */
export interface ModuleDto  {
  id: number;
  parentModuleId?: number | null;
  index?: string | null;
  curriculumId: number;
  parentSemesterId: number;
  name: string;
  atoms: AtomDto[];
  modules: ModuleDto[];
  selection?: SelectionDto | null;
  semesters: RefModuleSemesterDto[];
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
    if (Array.isArray(_data["semesters"])) {
      _data.semesters = _data["semesters"].map(item => 
        initRefModuleSemesterDto(item)
      );
    }
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
  if (Array.isArray(_data.semesters)) {
    data["semesters"] = _data.semesters.map(item => 
        prepareSerializeRefModuleSemesterDto(item)
    );
  }
  return data as ModuleDto;
}
export interface AtomDto  {
  id: number;
  parentModuleId?: number | null;
  index?: string | null;
  curriculumId: number;
  name: string;
  isRequired: boolean;
  type: AtomType;
  semesters: RefAtomSemesterDto[];
  competenceIds: number[];
  competenceIndicatorIds: number[];
  department?: DepartmentDto | null;
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
        initRefAtomSemesterDto(item)
      );
    }
    _data.competenceIds = _data["competenceIds"];
    _data.competenceIndicatorIds = _data["competenceIndicatorIds"];
    _data.department = _data["department"] && initDepartmentDto(_data["department"]);
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
        prepareSerializeRefAtomSemesterDto(item)
    );
  }
  data["department"] = _data.department && prepareSerializeDepartmentDto(_data.department);
  return data as AtomDto;
}
export enum AtomType {
    Subject = "Subject",
    Practice = "Practice",
    Attestation = "Attestation",
    Elective = "Elective",
}
export interface RefAtomSemesterDto extends ComponentSemesterDto  {
  semester: SemesterDto;
}
export function deserializeRefAtomSemesterDto(json: string): RefAtomSemesterDto {
  const data = JSON.parse(json) as RefAtomSemesterDto;
  initRefAtomSemesterDto(data);
  return data;
}
export function initRefAtomSemesterDto(_data: RefAtomSemesterDto) {
  initComponentSemesterDto(_data);
  if (_data) {
    _data.semester = _data["semester"] && initSemesterDto(_data["semester"]);
  }
  return _data;
}
export function serializeRefAtomSemesterDto(_data: RefAtomSemesterDto | undefined) {
  if (_data) {
    _data = prepareSerializeRefAtomSemesterDto(_data as RefAtomSemesterDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeRefAtomSemesterDto(_data: RefAtomSemesterDto): RefAtomSemesterDto {
  const data = prepareSerializeComponentSemesterDto(_data as RefAtomSemesterDto) as Record<string, any>;
  data["semester"] = _data.semester && prepareSerializeSemesterDto(_data.semester);
  return data as RefAtomSemesterDto;
}
export interface UpdateModuleDto  {
  parentModuleId?: number | null;
  parentSemesterId?: number | null;
  order?: number | null;
  name?: string | null;
}
export function deserializeUpdateModuleDto(json: string): UpdateModuleDto {
  const data = JSON.parse(json) as UpdateModuleDto;
  initUpdateModuleDto(data);
  return data;
}
export function initUpdateModuleDto(_data: UpdateModuleDto) {
    return _data;
}
export function serializeUpdateModuleDto(_data: UpdateModuleDto | undefined) {
  if (_data) {
    _data = prepareSerializeUpdateModuleDto(_data as UpdateModuleDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeUpdateModuleDto(_data: UpdateModuleDto): UpdateModuleDto {
  const data: Record<string, any> = { ..._data };
  return data as UpdateModuleDto;
}
export interface CreateAtomDto  {
  curriculumId: number;
  parentModuleId?: number | null;
  name: string;
  isRequired: boolean;
  order?: number | null;
  type: AtomType;
  semesterIds: number[];
}
export function deserializeCreateAtomDto(json: string): CreateAtomDto {
  const data = JSON.parse(json) as CreateAtomDto;
  initCreateAtomDto(data);
  return data;
}
export function initCreateAtomDto(_data: CreateAtomDto) {
  if (_data) {
    _data.type = _data["type"];
    _data.semesterIds = _data["semesterIds"];
  }
  return _data;
}
export function serializeCreateAtomDto(_data: CreateAtomDto | undefined) {
  if (_data) {
    _data = prepareSerializeCreateAtomDto(_data as CreateAtomDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeCreateAtomDto(_data: CreateAtomDto): CreateAtomDto {
  const data: Record<string, any> = { ..._data };
  return data as CreateAtomDto;
}
export interface UpdateAtomDto  {
  parentModuleId?: number | null;
  name?: string | null;
  isRequired?: boolean | null;
  order?: number | null;
  type?: AtomType | null;
  semesterIds?: { [key: string]: number; } | null;
  departmentId?: number | null;
}
export function deserializeUpdateAtomDto(json: string): UpdateAtomDto {
  const data = JSON.parse(json) as UpdateAtomDto;
  initUpdateAtomDto(data);
  return data;
}
export function initUpdateAtomDto(_data: UpdateAtomDto) {
  if (_data) {
    _data.type = _data["type"];
  }
  return _data;
}
export function serializeUpdateAtomDto(_data: UpdateAtomDto | undefined) {
  if (_data) {
    _data = prepareSerializeUpdateAtomDto(_data as UpdateAtomDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeUpdateAtomDto(_data: UpdateAtomDto): UpdateAtomDto {
  const data: Record<string, any> = { ..._data };
  return data as UpdateAtomDto;
}
export interface SetAtomCompetencesDto  {
  competenceIds: number[];
}
export function deserializeSetAtomCompetencesDto(json: string): SetAtomCompetencesDto {
  const data = JSON.parse(json) as SetAtomCompetencesDto;
  initSetAtomCompetencesDto(data);
  return data;
}
export function initSetAtomCompetencesDto(_data: SetAtomCompetencesDto) {
  if (_data) {
    _data.competenceIds = _data["competenceIds"];
  }
  return _data;
}
export function serializeSetAtomCompetencesDto(_data: SetAtomCompetencesDto | undefined) {
  if (_data) {
    _data = prepareSerializeSetAtomCompetencesDto(_data as SetAtomCompetencesDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeSetAtomCompetencesDto(_data: SetAtomCompetencesDto): SetAtomCompetencesDto {
  const data: Record<string, any> = { ..._data };
  return data as SetAtomCompetencesDto;
}
export interface SetAtomCompetenceIndicatorsDto  {
  competenceIndicatorIds: number[];
}
export function deserializeSetAtomCompetenceIndicatorsDto(json: string): SetAtomCompetenceIndicatorsDto {
  const data = JSON.parse(json) as SetAtomCompetenceIndicatorsDto;
  initSetAtomCompetenceIndicatorsDto(data);
  return data;
}
export function initSetAtomCompetenceIndicatorsDto(_data: SetAtomCompetenceIndicatorsDto) {
  if (_data) {
    _data.competenceIndicatorIds = _data["competenceIndicatorIds"];
  }
  return _data;
}
export function serializeSetAtomCompetenceIndicatorsDto(_data: SetAtomCompetenceIndicatorsDto | undefined) {
  if (_data) {
    _data = prepareSerializeSetAtomCompetenceIndicatorsDto(_data as SetAtomCompetenceIndicatorsDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeSetAtomCompetenceIndicatorsDto(_data: SetAtomCompetenceIndicatorsDto): SetAtomCompetenceIndicatorsDto {
  const data: Record<string, any> = { ..._data };
  return data as SetAtomCompetenceIndicatorsDto;
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
/** Data transfer object for tokens. */
export interface TokenDto  {
  /** Expired access token */
  accessToken: string;
  /** Refresh token */
  refreshToken: string;
}
export function deserializeTokenDto(json: string): TokenDto {
  const data = JSON.parse(json) as TokenDto;
  initTokenDto(data);
  return data;
}
export function initTokenDto(_data: TokenDto) {
    return _data;
}
export function serializeTokenDto(_data: TokenDto | undefined) {
  if (_data) {
    _data = prepareSerializeTokenDto(_data as TokenDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeTokenDto(_data: TokenDto): TokenDto {
  const data: Record<string, any> = { ..._data };
  return data as TokenDto;
}
export interface RegisterDto  {
  /** User`s email */
  email: string;
  /** User`s password */
  password: string;
  /** User`s first name */
  firstName: string;
  /** User`s last name */
  lastName: string;
}
export function deserializeRegisterDto(json: string): RegisterDto {
  const data = JSON.parse(json) as RegisterDto;
  initRegisterDto(data);
  return data;
}
export function initRegisterDto(_data: RegisterDto) {
    return _data;
}
export function serializeRegisterDto(_data: RegisterDto | undefined) {
  if (_data) {
    _data = prepareSerializeRegisterDto(_data as RegisterDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeRegisterDto(_data: RegisterDto): RegisterDto {
  const data: Record<string, any> = { ..._data };
  return data as RegisterDto;
}
/** Data transfer object for user login. */
export interface LoginDto  {
  /** User email */
  email: string;
  /** User password */
  password: string;
}
export function deserializeLoginDto(json: string): LoginDto {
  const data = JSON.parse(json) as LoginDto;
  initLoginDto(data);
  return data;
}
export function initLoginDto(_data: LoginDto) {
    return _data;
}
export function serializeLoginDto(_data: LoginDto | undefined) {
  if (_data) {
    _data = prepareSerializeLoginDto(_data as LoginDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeLoginDto(_data: LoginDto): LoginDto {
  const data: Record<string, any> = { ..._data };
  return data as LoginDto;
}
/** Data transfer object for changing password */
export interface ChangePasswordDto  {
  /** Old password */
  oldPassword: string;
  /** New password */
  newPassword: string;
}
export function deserializeChangePasswordDto(json: string): ChangePasswordDto {
  const data = JSON.parse(json) as ChangePasswordDto;
  initChangePasswordDto(data);
  return data;
}
export function initChangePasswordDto(_data: ChangePasswordDto) {
    return _data;
}
export function serializeChangePasswordDto(_data: ChangePasswordDto | undefined) {
  if (_data) {
    _data = prepareSerializeChangePasswordDto(_data as ChangePasswordDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeChangePasswordDto(_data: ChangePasswordDto): ChangePasswordDto {
  const data: Record<string, any> = { ..._data };
  return data as ChangePasswordDto;
}
export interface UserDto  {
  /** User`s email */
  email: string;
  /** User`s first name */
  firstName: string;
  /** User`s last name */
  lastName: string;
}
export function deserializeUserDto(json: string): UserDto {
  const data = JSON.parse(json) as UserDto;
  initUserDto(data);
  return data;
}
export function initUserDto(_data: UserDto) {
    return _data;
}
export function serializeUserDto(_data: UserDto | undefined) {
  if (_data) {
    _data = prepareSerializeUserDto(_data as UserDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeUserDto(_data: UserDto): UserDto {
  const data: Record<string, any> = { ..._data };
  return data as UserDto;
}
export interface SetAttestationDto  {
  semesterId: number;
  atomId: number;
  attestationIds: number[];
}
export function deserializeSetAttestationDto(json: string): SetAttestationDto {
  const data = JSON.parse(json) as SetAttestationDto;
  initSetAttestationDto(data);
  return data;
}
export function initSetAttestationDto(_data: SetAttestationDto) {
  if (_data) {
    _data.attestationIds = _data["attestationIds"];
  }
  return _data;
}
export function serializeSetAttestationDto(_data: SetAttestationDto | undefined) {
  if (_data) {
    _data = prepareSerializeSetAttestationDto(_data as SetAttestationDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeSetAttestationDto(_data: SetAttestationDto): SetAttestationDto {
  const data: Record<string, any> = { ..._data };
  return data as SetAttestationDto;
}
export interface SetAtomCreditDto  {
  credit: number;
}
export function deserializeSetAtomCreditDto(json: string): SetAtomCreditDto {
  const data = JSON.parse(json) as SetAtomCreditDto;
  initSetAtomCreditDto(data);
  return data;
}
export function initSetAtomCreditDto(_data: SetAtomCreditDto) {
    return _data;
}
export function serializeSetAtomCreditDto(_data: SetAtomCreditDto | undefined) {
  if (_data) {
    _data = prepareSerializeSetAtomCreditDto(_data as SetAtomCreditDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeSetAtomCreditDto(_data: SetAtomCreditDto): SetAtomCreditDto {
  const data: Record<string, any> = { ..._data };
  return data as SetAtomCreditDto;
}
export interface CreateAcademicActivityDto  {
  name: string;
  shortName: string;
  isCountable: boolean;
  isIncludedInDocumentation: boolean;
  formula?: string | null;
  formulaName?: string | null;
}
export function deserializeCreateAcademicActivityDto(json: string): CreateAcademicActivityDto {
  const data = JSON.parse(json) as CreateAcademicActivityDto;
  initCreateAcademicActivityDto(data);
  return data;
}
export function initCreateAcademicActivityDto(_data: CreateAcademicActivityDto) {
    return _data;
}
export function serializeCreateAcademicActivityDto(_data: CreateAcademicActivityDto | undefined) {
  if (_data) {
    _data = prepareSerializeCreateAcademicActivityDto(_data as CreateAcademicActivityDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeCreateAcademicActivityDto(_data: CreateAcademicActivityDto): CreateAcademicActivityDto {
  const data: Record<string, any> = { ..._data };
  return data as CreateAcademicActivityDto;
}
export interface UpdateAcademicActivityDto  {
  name?: string | null;
  shortName?: string | null;
  order?: number | null;
  formula?: string | null;
  formulaName?: string | null;
}
export function deserializeUpdateAcademicActivityDto(json: string): UpdateAcademicActivityDto {
  const data = JSON.parse(json) as UpdateAcademicActivityDto;
  initUpdateAcademicActivityDto(data);
  return data;
}
export function initUpdateAcademicActivityDto(_data: UpdateAcademicActivityDto) {
    return _data;
}
export function serializeUpdateAcademicActivityDto(_data: UpdateAcademicActivityDto | undefined) {
  if (_data) {
    _data = prepareSerializeUpdateAcademicActivityDto(_data as UpdateAcademicActivityDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeUpdateAcademicActivityDto(_data: UpdateAcademicActivityDto): UpdateAcademicActivityDto {
  const data: Record<string, any> = { ..._data };
  return data as UpdateAcademicActivityDto;
}
export interface CreateUpdateHoursDistributionDto  {
  value: number;
}
export function deserializeCreateUpdateHoursDistributionDto(json: string): CreateUpdateHoursDistributionDto {
  const data = JSON.parse(json) as CreateUpdateHoursDistributionDto;
  initCreateUpdateHoursDistributionDto(data);
  return data;
}
export function initCreateUpdateHoursDistributionDto(_data: CreateUpdateHoursDistributionDto) {
    return _data;
}
export function serializeCreateUpdateHoursDistributionDto(_data: CreateUpdateHoursDistributionDto | undefined) {
  if (_data) {
    _data = prepareSerializeCreateUpdateHoursDistributionDto(_data as CreateUpdateHoursDistributionDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeCreateUpdateHoursDistributionDto(_data: CreateUpdateHoursDistributionDto): CreateUpdateHoursDistributionDto {
  const data: Record<string, any> = { ..._data };
  return data as CreateUpdateHoursDistributionDto;
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
export interface FileResponse {
    data: Blob;
    status: number;
    fileName?: string;
    headers?: { [name: string]: any };
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