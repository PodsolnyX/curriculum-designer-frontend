import {AtomType, CompetenceType} from "@/api/axios-client.ts";
import {CompetenceTypeName} from "@/pages/planPage/types/types.ts";

export const CompetenceTypeName: Record<CompetenceType, CompetenceTypeName> = {
    [CompetenceType.Universal]: {name: "Универсальные", shortName: "УК"},
    [CompetenceType.Basic]: {name: "Базовые", shortName: "БК"},
    [CompetenceType.GeneralProfessional]: {name: "Обще-профессиональные", shortName: "ОПК"},
    [CompetenceType.Professional]: {name: "Профессиональные", shortName: "ПК"}
}

export const AtomTypeFullName: Record<AtomType, {name: string, color: string}> = {
    [AtomType.Subject]: {name: "Дисциплина", color: "blue"},
    [AtomType.Practice]: {name: "Практика", color: "orange"},
    [AtomType.Attestation]: {name: "ГИА", color: "red"},
    [AtomType.Elective]: {name: "Факультатив", color: "purple"}
}