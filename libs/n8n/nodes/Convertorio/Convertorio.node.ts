import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestMethods,
	IRequestOptions,
	IBinaryData,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

export class Convertorio implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Convertorio',
		name: 'convertorio',
		icon: 'file:convertorio.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Convert images between 20+ formats, generate PDF thumbnails, and extract text with AI-powered OCR',
		defaults: {
			name: 'Convertorio',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'convertorioApi',
				required: true,
			},
		],
		properties: [
			// Operation Selection
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Convert Image',
						value: 'convertImage',
						description: 'Convert an image to a different format',
						action: 'Convert an image to a different format',
					},
					{
						name: 'PDF Thumbnail',
						value: 'pdfThumbnail',
						description: 'Generate a JPG thumbnail from a PDF document',
						action: 'Generate a JPG thumbnail from a PDF document',
					},
					{
						name: 'PDF to Images',
						value: 'pdfToImages',
						description: 'Convert PDF pages to JPG images (one per page)',
						action: 'Convert PDF pages to JPG images',
					},
					{
						name: 'OCR (Extract Text)',
						value: 'ocr',
						description: 'Extract text from an image using AI-powered OCR',
						action: 'Extract text from an image using AI-powered OCR',
					},
					{
						name: 'Get Account Info',
						value: 'getAccount',
						description: 'Get account information and points balance',
						action: 'Get account information and points balance',
					},
				],
				default: 'convertImage',
			},

			// ============================================
			// Convert Image Operation
			// ============================================
			{
				displayName: 'Input Binary Field',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				displayOptions: {
					show: {
						operation: ['convertImage', 'pdfThumbnail', 'pdfToImages', 'ocr'],
					},
				},
				description: 'Name of the binary property containing the file to convert',
			},
			{
				displayName: 'Target Format',
				name: 'targetFormat',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['convertImage'],
					},
				},
				options: [
					{ name: 'AVIF', value: 'avif' },
					{ name: 'BMP', value: 'bmp' },
					{ name: 'GIF', value: 'gif' },
					{ name: 'HEIC', value: 'heic' },
					{ name: 'ICO', value: 'ico' },
					{ name: 'JPG/JPEG', value: 'jpg' },
					{ name: 'JXL (JPEG XL)', value: 'jxl' },
					{ name: 'PNG', value: 'png' },
					{ name: 'TIFF', value: 'tiff' },
					{ name: 'WebP', value: 'webp' },
				],
				default: 'webp',
				required: true,
				description: 'Target format to convert the image to',
			},
			{
				displayName: 'Quality',
				name: 'quality',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['convertImage'],
						targetFormat: ['jpg', 'webp', 'avif', 'heic', 'jxl'],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 90,
				description: 'Compression quality (1-100). Higher values mean better quality but larger files.',
			},
			{
				displayName: 'Resize Options',
				name: 'resizeOptions',
				type: 'collection',
				placeholder: 'Add Resize Option',
				default: {},
				displayOptions: {
					show: {
						operation: ['convertImage'],
					},
				},
				options: [
					{
						displayName: 'Width',
						name: 'resize_width',
						type: 'number',
						default: 0,
						typeOptions: {
							minValue: 1,
							maxValue: 10000,
						},
						description: 'Target width in pixels. Set to 0 to keep original or auto-calculate from height.',
					},
					{
						displayName: 'Height',
						name: 'resize_height',
						type: 'number',
						default: 0,
						typeOptions: {
							minValue: 1,
							maxValue: 10000,
						},
						description: 'Target height in pixels. Set to 0 to keep original or auto-calculate from width.',
					},
					{
						displayName: 'Aspect Ratio',
						name: 'aspect_ratio',
						type: 'options',
						options: [
							{ name: 'Original', value: 'original' },
							{ name: '1:1 (Square)', value: '1:1' },
							{ name: '4:3', value: '4:3' },
							{ name: '16:9', value: '16:9' },
							{ name: '9:16 (Portrait)', value: '9:16' },
							{ name: '21:9 (Ultrawide)', value: '21:9' },
						],
						default: 'original',
						description: 'Target aspect ratio for the image',
					},
					{
						displayName: 'Crop Strategy',
						name: 'crop_strategy',
						type: 'options',
						options: [
							{ name: 'Fit (Letterbox)', value: 'fit' },
							{ name: 'Crop Center', value: 'crop-center' },
							{ name: 'Crop Top', value: 'crop-top' },
							{ name: 'Crop Bottom', value: 'crop-bottom' },
							{ name: 'Crop Left', value: 'crop-left' },
							{ name: 'Crop Right', value: 'crop-right' },
						],
						default: 'crop-center',
						description: 'How to handle images that do not match the target aspect ratio',
					},
				],
			},
			{
				displayName: 'ICO Options',
				name: 'icoOptions',
				type: 'collection',
				placeholder: 'Add ICO Option',
				default: {},
				displayOptions: {
					show: {
						operation: ['convertImage'],
						targetFormat: ['ico'],
					},
				},
				options: [
					{
						displayName: 'Icon Size',
						name: 'icon_size',
						type: 'options',
						options: [
							{ name: '16x16', value: 16 },
							{ name: '32x32', value: 32 },
							{ name: '48x48', value: 48 },
							{ name: '64x64', value: 64 },
							{ name: '128x128', value: 128 },
							{ name: '256x256', value: 256 },
						],
						default: 32,
						description: 'Size of the icon in pixels',
					},
				],
			},

			// ============================================
			// PDF Thumbnail Operation
			// ============================================
			{
				displayName: 'Thumbnail Width',
				name: 'thumbnailWidth',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['pdfThumbnail'],
					},
				},
				typeOptions: {
					minValue: 50,
					maxValue: 2000,
				},
				default: 800,
				description: 'Width of the thumbnail in pixels (50-2000)',
			},
			{
				displayName: 'Crop Mode',
				name: 'thumbnailCrop',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['pdfThumbnail'],
					},
				},
				options: [
					{ name: 'Full Page (100%)', value: 'full' },
					{ name: 'Top Half (50%)', value: 'half' },
					{ name: 'Top Third (33%)', value: 'third' },
					{ name: 'Top Quarter (25%)', value: 'quarter' },
					{ name: 'Top Two-Thirds (66%)', value: 'two-thirds' },
				],
				default: 'full',
				description: 'Portion of the PDF page to capture (from top)',
			},

			// ============================================
			// PDF to Images Operation
			// ============================================
			{
				displayName: 'Image Width',
				name: 'imagesWidth',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['pdfToImages'],
					},
				},
				typeOptions: {
					minValue: 50,
					maxValue: 4000,
				},
				default: 1200,
				description: 'Width of each output image in pixels (50-4000)',
			},
			{
				displayName: 'Image Quality',
				name: 'imagesQuality',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['pdfToImages'],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 90,
				description: 'JPEG quality (1-100). Higher values mean better quality but larger files.',
			},
			{
				displayName: 'DPI',
				name: 'imagesDpi',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['pdfToImages'],
					},
				},
				typeOptions: {
					minValue: 72,
					maxValue: 300,
				},
				default: 150,
				description: 'DPI for rendering PDF pages (72-300). Higher values produce sharper images.',
			},

			// ============================================
			// OCR Operation
			// ============================================
			{
				displayName: 'Output Format',
				name: 'ocrOutputFormat',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['ocr'],
					},
				},
				options: [
					{ name: 'Plain Text (TXT)', value: 'txt' },
					{ name: 'Structured JSON', value: 'json' },
				],
				default: 'txt',
				description: 'Format of the OCR output',
			},

			// ============================================
			// Output Options (for all file operations)
			// ============================================
			{
				displayName: 'Output Binary Field',
				name: 'outputBinaryPropertyName',
				type: 'string',
				default: 'data',
				displayOptions: {
					show: {
						operation: ['convertImage', 'pdfThumbnail', 'pdfToImages'],
					},
				},
				description: 'Name of the binary property to store the converted file(s). For PDF to Images, multiple binary properties will be created (data_1, data_2, etc.)',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;

				if (operation === 'getAccount') {
					// Get Account Info
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'convertorioApi',
						{
							method: 'GET' as IHttpRequestMethods,
							url: 'https://api.convertorio.com/v1/account',
							json: true,
						},
					);

					returnData.push({
						json: response,
						pairedItem: { item: i },
					});
				} else if (operation === 'convertImage' || operation === 'pdfThumbnail' || operation === 'pdfToImages' || operation === 'ocr') {
					// File conversion operations
					const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
					const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);

					// Get file info
					const fileName = binaryData.fileName || 'file';
					const mimeType = binaryData.mimeType || 'application/octet-stream';
					const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';

					// Build conversion metadata
					const conversionMetadata: Record<string, unknown> = {};
					let targetFormat: string;

					if (operation === 'convertImage') {
						targetFormat = this.getNodeParameter('targetFormat', i) as string;

						// Add quality for lossy formats
						if (['jpg', 'webp', 'avif', 'heic', 'jxl'].includes(targetFormat)) {
							const quality = this.getNodeParameter('quality', i, 90) as number;
							if (quality !== 90) {
								conversionMetadata.quality = quality;
							}
						}

						// Add resize options
						const resizeOptions = this.getNodeParameter('resizeOptions', i, {}) as Record<string, unknown>;
						if (resizeOptions.resize_width && resizeOptions.resize_width !== 0) {
							conversionMetadata.resize_width = resizeOptions.resize_width;
						}
						if (resizeOptions.resize_height && resizeOptions.resize_height !== 0) {
							conversionMetadata.resize_height = resizeOptions.resize_height;
						}
						if (resizeOptions.aspect_ratio && resizeOptions.aspect_ratio !== 'original') {
							conversionMetadata.aspect_ratio = resizeOptions.aspect_ratio;
							if (resizeOptions.crop_strategy) {
								conversionMetadata.crop_strategy = resizeOptions.crop_strategy;
							}
						}

						// Add ICO options
						if (targetFormat === 'ico') {
							const icoOptions = this.getNodeParameter('icoOptions', i, {}) as Record<string, unknown>;
							if (icoOptions.icon_size) {
								conversionMetadata.icon_size = icoOptions.icon_size;
							}
						}
					} else if (operation === 'pdfThumbnail') {
						targetFormat = 'thumbnail';
						const thumbnailWidth = this.getNodeParameter('thumbnailWidth', i, 800) as number;
						const thumbnailCrop = this.getNodeParameter('thumbnailCrop', i, 'full') as string;

						conversionMetadata.thumbnail_width = thumbnailWidth;
						if (thumbnailCrop !== 'full') {
							conversionMetadata.thumbnail_crop = thumbnailCrop;
						}
					} else if (operation === 'pdfToImages') {
						targetFormat = 'images';
						const imagesWidth = this.getNodeParameter('imagesWidth', i, 1200) as number;
						const imagesQuality = this.getNodeParameter('imagesQuality', i, 90) as number;
						const imagesDpi = this.getNodeParameter('imagesDpi', i, 150) as number;

						conversionMetadata.images_width = imagesWidth;
						conversionMetadata.images_quality = imagesQuality;
						conversionMetadata.images_dpi = imagesDpi;
					} else {
						// OCR
						targetFormat = 'ocr';
						const ocrOutputFormat = this.getNodeParameter('ocrOutputFormat', i, 'txt') as string;
						conversionMetadata.ocr_output_format = ocrOutputFormat;
					}

					// Step 1: Get upload URL
					const uploadUrlResponse = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'convertorioApi',
						{
							method: 'POST' as IHttpRequestMethods,
							url: 'https://api.convertorio.com/v1/convert/upload-url',
							body: {
								filename: fileName,
								source_format: fileExtension,
								target_format: targetFormat,
								file_size: binaryData.fileSize || 0,
								...(Object.keys(conversionMetadata).length > 0 && {
									conversion_metadata: conversionMetadata,
								}),
							},
							json: true,
						},
					);

					if (!uploadUrlResponse.success) {
						throw new NodeOperationError(
							this.getNode(),
							uploadUrlResponse.error || 'Failed to get upload URL',
							{ itemIndex: i },
						);
					}

					const { job_id, upload_url } = uploadUrlResponse;

					// Step 2: Upload file to S3
					const fileBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

					await this.helpers.httpRequest({
						method: 'PUT' as IHttpRequestMethods,
						url: upload_url,
						body: fileBuffer,
						headers: {
							'Content-Type': mimeType,
						},
					});

					// Step 3: Confirm upload
					const confirmResponse = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'convertorioApi',
						{
							method: 'POST' as IHttpRequestMethods,
							url: 'https://api.convertorio.com/v1/convert/confirm',
							body: { job_id },
							json: true,
						},
					);

					if (!confirmResponse.success) {
						throw new NodeOperationError(
							this.getNode(),
							confirmResponse.error || 'Failed to confirm upload',
							{ itemIndex: i },
						);
					}

					// Step 4: Poll for completion
					let jobResult;
					const maxAttempts = 60;
					const pollInterval = 2000;

					for (let attempt = 0; attempt < maxAttempts; attempt++) {
						if (attempt > 0) {
							await new Promise((resolve) => setTimeout(resolve, pollInterval));
						}

						const statusResponse = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'convertorioApi',
							{
								method: 'GET' as IHttpRequestMethods,
								url: `https://api.convertorio.com/v1/jobs/${job_id}`,
								json: true,
							},
						);

						if (!statusResponse.success) {
							throw new NodeOperationError(
								this.getNode(),
								'Failed to get job status',
								{ itemIndex: i },
							);
						}

						const job = statusResponse.job;

						if (job.status === 'completed') {
							jobResult = job;
							break;
						}

						if (job.status === 'failed') {
							throw new NodeOperationError(
								this.getNode(),
								job.error_message || 'Conversion failed',
								{ itemIndex: i },
							);
						}

						if (job.status === 'expired') {
							throw new NodeOperationError(
								this.getNode(),
								'Job expired',
								{ itemIndex: i },
							);
						}
					}

					if (!jobResult) {
						throw new NodeOperationError(
							this.getNode(),
							'Conversion timeout - job did not complete in time',
							{ itemIndex: i },
						);
					}

					// Step 5: Download result and return
					if (operation === 'ocr') {
						// For OCR, return the text directly
						returnData.push({
							json: {
								success: true,
								jobId: job_id,
								text: jobResult.ocr_text || '',
								tokensUsed: jobResult.tokens_used,
								processingTime: jobResult.processing_time_ms,
							},
							pairedItem: { item: i },
						});
					} else if (operation === 'pdfToImages' && jobResult.download_urls && Array.isArray(jobResult.download_urls)) {
						// For PDF to Images, download all files and return multiple items
						const outputBinaryPropertyName = this.getNodeParameter(
							'outputBinaryPropertyName',
							i,
							'data',
						) as string;

						// Download each page as a separate output item
						for (const fileInfo of jobResult.download_urls) {
							const convertedFileResponse = await this.helpers.httpRequest({
								method: 'GET' as IHttpRequestMethods,
								url: fileInfo.download_url,
								encoding: 'arraybuffer',
								returnFullResponse: true,
							});

							const newBinaryData: IBinaryData = await this.helpers.prepareBinaryData(
								Buffer.from(convertedFileResponse.body as Buffer),
								fileInfo.filename,
								'image/jpeg',
							);

							returnData.push({
								json: {
									success: true,
									jobId: job_id,
									sourceFormat: fileExtension,
									targetFormat: 'images',
									pageNumber: fileInfo.page_number,
									totalPages: jobResult.download_urls.length,
									width: fileInfo.width,
									height: fileInfo.height,
									fileSize: fileInfo.file_size,
									processingTime: jobResult.processing_time_ms,
								},
								binary: {
									[outputBinaryPropertyName]: newBinaryData,
								},
								pairedItem: { item: i },
							});
						}
					} else {
						// For image/PDF conversions, download the file
						const outputBinaryPropertyName = this.getNodeParameter(
							'outputBinaryPropertyName',
							i,
							'data',
						) as string;

						const convertedFileResponse = await this.helpers.httpRequest({
							method: 'GET' as IHttpRequestMethods,
							url: jobResult.download_url,
							encoding: 'arraybuffer',
							returnFullResponse: true,
						});

						const outputFileName = operation === 'pdfThumbnail'
							? fileName.replace(/\.pdf$/i, '.jpg')
							: `${fileName.split('.').slice(0, -1).join('.')}.${targetFormat}`;

						const outputMimeType = operation === 'pdfThumbnail'
							? 'image/jpeg'
							: `image/${targetFormat}`;

						const newBinaryData: IBinaryData = await this.helpers.prepareBinaryData(
							Buffer.from(convertedFileResponse.body as Buffer),
							outputFileName,
							outputMimeType,
						);

						returnData.push({
							json: {
								success: true,
								jobId: job_id,
								sourceFormat: fileExtension,
								targetFormat,
								fileSize: jobResult.file_size,
								tokensUsed: jobResult.tokens_used,
								processingTime: jobResult.processing_time_ms,
							},
							binary: {
								[outputBinaryPropertyName]: newBinaryData,
							},
							pairedItem: { item: i },
						});
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							success: false,
							error: (error as Error).message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
