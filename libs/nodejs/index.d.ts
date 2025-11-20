import { EventEmitter } from 'events';

export interface ConvertorioConfig {
    apiKey: string;
    baseUrl?: string;
}

export interface ConversionMetadata {
    aspect_ratio?: string;
    crop_strategy?: 'fit' | 'crop-center' | 'crop-top' | 'crop-bottom' | 'crop-left' | 'crop-right';
    quality?: number;
    icon_size?: 16 | 32 | 48 | 64 | 128 | 256;
    resize_width?: number;
    resize_height?: number;
}

export interface ConversionOptions {
    inputPath: string;
    targetFormat: string;
    outputPath?: string;
    conversionMetadata?: ConversionMetadata;
}

export interface ConversionResult {
    success: boolean;
    jobId: string;
    inputPath: string;
    outputPath: string;
    sourceFormat: string;
    targetFormat: string;
    fileSize: number;
    processingTime: number;
    downloadUrl: string;
}

export interface ProgressEvent {
    step: 'requesting-upload-url' | 'uploading' | 'confirming' | 'converting' | 'downloading';
    message: string;
    jobId?: string;
    status?: string;
}

export interface StatusEvent {
    jobId: string;
    status: string;
    attempt: number;
    maxAttempts: number;
}

export interface StartEvent {
    fileName: string;
    sourceFormat: string;
    targetFormat: string;
}

export interface ErrorEvent {
    success: false;
    error: string;
    inputPath: string;
    targetFormat: string;
}

export interface AccountInfo {
    id: string;
    email: string;
    name: string;
    plan: string;
    points: number;
    daily_conversions_remaining: number;
    daily_ai_remaining: number;
    total_conversions: number;
    total_ai_analyses: number;
}

export interface Job {
    id: string;
    status: string;
    original_filename: string;
    source_format: string;
    target_format: string;
    file_size: number;
    points_cost: number;
    points_used: number;
    processing_time_ms?: number;
    created_at: string;
    updated_at?: string;
    download_url?: string;
    error_message?: string;
}

export interface ListJobsOptions {
    limit?: number;
    offset?: number;
    status?: string;
}

export default class ConvertorioClient extends EventEmitter {
    constructor(config: ConvertorioConfig);

    convertFile(options: ConversionOptions): Promise<ConversionResult>;
    getAccount(): Promise<AccountInfo>;
    listJobs(options?: ListJobsOptions): Promise<Job[]>;
    getJob(jobId: string): Promise<Job>;

    on(event: 'start', listener: (data: StartEvent) => void): this;
    on(event: 'progress', listener: (data: ProgressEvent) => void): this;
    on(event: 'status', listener: (data: StatusEvent) => void): this;
    on(event: 'complete', listener: (data: ConversionResult) => void): this;
    on(event: 'error', listener: (data: ErrorEvent) => void): this;
}
