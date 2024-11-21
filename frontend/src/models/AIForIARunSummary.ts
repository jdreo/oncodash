
export type AIForIARunID = string

export interface InfPath {
    image: string
    roi: string
    analysisBatch: string
    aiModelName: string
    colorChannelCount: number
    classLabel: string
    classAlias: string
    layerName: string
    areaPercentage: number
    countPercentage: number
    count: number
    area_mm2: number
    confidenceAvg: number
    contentType: Unknown
    averageLengthUm: number
    averageWidthUm: number
    averageCircumferenceUm: number
}

export interface IASummary {
    items: Array<InfPath>
}

export interface AIForIARunSummary {
    iaSummary: Record<string, IASummary>
}

