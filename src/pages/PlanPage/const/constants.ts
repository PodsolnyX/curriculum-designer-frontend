import {AtomType, CompetenceType} from "@/api/axios-client.ts";

export const CompetenceTypeName: Record<CompetenceType, string> = {
    [CompetenceType.Universal]: "УК",
    [CompetenceType.Basic]: "БК",
    [CompetenceType.GeneralProfessional]: "ОПК",
    [CompetenceType.Professional]: "ПК"
}

export const AtomTypeFullName: Record<AtomType, {name: string, color: string}> = {
    [AtomType.Subject]: {name: "Дисциплина", color: "blue"},
    [AtomType.Practice]: {name: "Практика", color: "orange"},
    [AtomType.Attestation]: {name: "ГИА", color: "red"},
    [AtomType.Elective]: {name: "Факультатив", color: "purple"}
}