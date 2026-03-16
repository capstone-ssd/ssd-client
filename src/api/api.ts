/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface DocumentParagraphDto {
  content?: string;
  role?: string;
  /** @format int32 */
  pageNumber?: number;
  /** @format int32 */
  blockId?: number;
}

export interface UpdateDocumentRequest {
  title?: string;
  text?: string;
  summary?: string;
  details?: string;
  /** @format int64 */
  folderId?: number;
  bookmark?: boolean;
  paragraphs?: DocumentParagraphDto[];
}

export interface ApiResponseUpdateDocumentResponse {
  code?: string;
  msg?: string;
  data?: UpdateDocumentResponse;
}

export interface UpdateDocumentResponse {
  /** @format int64 */
  id?: number;
}

export interface ApiResponseString {
  code?: string;
  msg?: string;
  data?: string;
}

export interface ApiResponseBoolean {
  code?: string;
  msg?: string;
  data?: boolean;
}

export interface CreateFolderRequest {
  /** @minLength 1 */
  name: string;
  color?: string;
  /** @format int64 */
  parentId?: number;
}

export interface ApiResponseCreateFolderResponse {
  code?: string;
  msg?: string;
  data?: CreateFolderResponse;
}

export interface CreateFolderResponse {
  /** @format int64 */
  id?: number;
}

export interface ExternalDocumentIdRequest {
  /** @minLength 1 */
  docId: string;
}

export interface ApiResponseExternalSummarizationKeywordResponse {
  code?: string;
  msg?: string;
  data?: ExternalSummarizationKeywordResponse;
}

export interface ExternalSummarizationKeywordResponse {
  doc_id?: string;
  keyword?: string;
}

export interface ApiResponseExternalSummarizationBasicResponse {
  code?: string;
  msg?: string;
  data?: ExternalSummarizationBasicResponse;
}

export interface ExternalSummarizationBasicResponse {
  doc_id?: string;
  summary?: string;
  small?: string;
}

export interface ApiResponseExternalEvaluationResponse {
  code?: string;
  msg?: string;
  data?: ExternalEvaluationResponse;
}

export interface ExternalEvaluationReportResponse {
  TeamEvaluator?: ExternalEvaluatorMetricResponse;
  SolEvaluator?: ExternalEvaluatorMetricResponse;
  ProblemEvaluator?: ExternalEvaluatorMetricResponse;
  BusinessModelEvaluator?: ExternalEvaluatorMetricResponse;
  ScaleUpEvaluator?: ExternalEvaluatorMetricResponse;
}

export interface ExternalEvaluationResponse {
  doc_id?: string;
  evaluation_report?: ExternalEvaluationReportResponse;
  check_list?: Record<string, boolean>;
}

export interface ExternalEvaluatorMetricResponse {
  /** @format double */
  average_score?: number;
  final_review?: string;
}

export interface ExternalCheckNewTextRequest {
  /** @minLength 1 */
  block_id: string;
  /** @minLength 1 */
  block: string;
}

export interface ApiResponseExternalCheckNewTextResponse {
  code?: string;
  msg?: string;
  data?: ExternalCheckNewTextResponse;
}

export interface ExternalCheckNewTextResponse {
  block_id?: string;
  check_list?: Record<string, boolean>;
}

export interface CreateDocumentRequest {
  title?: string;
  /** @minLength 1 */
  text: string;
  paragraphs?: DocumentParagraphDto[];
  /** @format int64 */
  folderId?: number;
}

export interface ApiResponseCreateDocumentResponse {
  code?: string;
  msg?: string;
  data?: CreateDocumentResponse;
}

export interface CreateDocumentResponse {
  /** @format int64 */
  id?: number;
}

export interface ApiResponseThreeLineSummaryResponse {
  code?: string;
  msg?: string;
  data?: ThreeLineSummaryResponse;
}

export interface ThreeLineSummaryResponse {
  /** @format int64 */
  documentId?: number;
  lines?: string[];
}

export interface EvaluatorReviewRequest {
  /**
   * @format int32
   * @min 0
   * @max 100
   */
  feasibility: number;
  /**
   * @format int32
   * @min 0
   * @max 100
   */
  differentiation: number;
  /**
   * @format int32
   * @min 0
   * @max 100
   */
  financial: number;
  comment?: string;
}

export interface ApiResponseEvaluatorReviewResponse {
  code?: string;
  msg?: string;
  data?: EvaluatorReviewResponse;
}

export interface EvaluatorReviewItemResponse {
  /** @format int64 */
  reviewId?: number;
  /** @format int64 */
  reviewerId?: number;
  reviewerName?: string;
  /** @format int32 */
  feasibility?: number;
  /** @format int32 */
  differentiation?: number;
  /** @format int32 */
  financial?: number;
  /** @format double */
  total?: number;
  comment?: string;
}

export interface EvaluatorReviewResponse {
  summary?: EvaluatorReviewSummaryResponse;
  reviews?: EvaluatorReviewItemResponse[];
}

export interface EvaluatorReviewSummaryResponse {
  /** @format int64 */
  documentId?: number;
  /** @format double */
  feasibilityAvg?: number;
  /** @format double */
  differentiationAvg?: number;
  /** @format double */
  financialAvg?: number;
  /** @format double */
  totalAvg?: number;
  /** @format int32 */
  reviewCount?: number;
}

export interface ApiResponseEvaluatorCheckListResponse {
  code?: string;
  msg?: string;
  data?: EvaluatorCheckListResponse;
}

export interface EvaluatorCheckListItemResponse {
  /** @format int64 */
  id?: number;
  content?: string;
  checked?: boolean;
}

export interface EvaluatorCheckListResponse {
  /** @format int64 */
  documentId?: number;
  items?: EvaluatorCheckListItemResponse[];
}

export interface ApiResponseDocumentEvaluationResponse {
  code?: string;
  msg?: string;
  data?: DocumentEvaluationResponse;
}

export interface DocumentEvaluationResponse {
  /** @format int64 */
  documentId?: number;
  evaluation?: string;
}

export interface ApiResponseDocumentDetailsResponse {
  code?: string;
  msg?: string;
  data?: DocumentDetailsResponse;
}

export interface DocumentDetailsResponse {
  /** @format int64 */
  documentId?: number;
  details?: string;
}

export interface DocumentCommentRequest {
  /**
   * @format int32
   * @min 1
   */
  blockId: number;
  /** @minLength 1 */
  comment: string;
}

export interface ApiResponseDocumentCommentResponse {
  code?: string;
  msg?: string;
  data?: DocumentCommentResponse;
}

export interface DocumentCommentResponse {
  /** @format int64 */
  id?: number;
}

export interface ApiResponseGenerateChecklistResponse {
  code?: string;
  msg?: string;
  data?: GenerateChecklistResponse;
}

export interface CheckListItemResponse {
  /** @format int64 */
  id?: number;
  content?: string;
  checked?: boolean;
}

export interface GenerateChecklistResponse {
  /** @format int64 */
  documentId?: number;
  items?: CheckListItemResponse[];
}

export interface UpdateFolderRequest {
  name?: string;
  color?: string;
  /** @format int64 */
  parentId?: number;
}

export interface ApiResponseUpdateFolderResponse {
  code?: string;
  msg?: string;
  data?: UpdateFolderResponse;
}

export interface UpdateFolderResponse {
  /** @format int64 */
  id?: number;
}

export interface ApiResponseDocumentBookmarkResponse {
  code?: string;
  msg?: string;
  data?: DocumentBookmarkResponse;
}

export interface DocumentBookmarkResponse {
  /** @format int64 */
  id?: number;
  bookmark?: boolean;
}

export interface DocumentCommentUpdateRequest {
  /** @minLength 1 */
  comment: string;
}

export interface ApiResponseCheckListItemResponse {
  code?: string;
  msg?: string;
  data?: CheckListItemResponse;
}

export interface ApiResponseFolderContentResponse {
  code?: string;
  msg?: string;
  data?: FolderContentResponse;
}

export interface DocumentListItemResponse {
  /** @format int64 */
  id?: number;
  title?: string;
  /** @format int64 */
  folderId?: number;
  /** @format date-time */
  updatedAt?: string;
}

export interface FolderContentResponse {
  /** @format int64 */
  parentId?: number;
  /** @format int64 */
  currentFolderId?: number;
  folders?: FolderListItemResponse[];
  documents?: DocumentListItemResponse[];
}

export interface FolderListItemResponse {
  /** @format int64 */
  id?: number;
  name?: string;
  color?: string;
  /** @format int64 */
  parentId?: number;
  hasChildren?: boolean;
  /** @format date-time */
  updatedAt?: string;
}

export interface ApiResponseListDocumentListItemResponse {
  code?: string;
  msg?: string;
  data?: DocumentListItemResponse[];
}

export interface ApiResponseGetDocumentResponse {
  code?: string;
  msg?: string;
  data?: GetDocumentResponse;
}

export interface GetDocumentResponse {
  /** @format int64 */
  id?: number;
  title?: string;
  text?: string;
  paragraphs?: DocumentParagraphDto[];
  summary?: string;
  details?: string;
  /** @format int64 */
  folderId?: number;
  bookmark?: boolean;
  /** @format int64 */
  authorId?: number;
  authorName?: string;
}

export interface ApiResponseDocumentLogResponse {
  code?: string;
  msg?: string;
  data?: DocumentLogResponse;
}

export interface DocumentLogItemResponse {
  editorName?: string;
  time?: string;
}

export interface DocumentLogResponse {
  /** @format int64 */
  documentId?: number;
  logs?: DocumentLogItemResponse[];
}

export interface ApiResponseListDocumentCommentItemResponse {
  code?: string;
  msg?: string;
  data?: DocumentCommentItemResponse[];
}

export interface DocumentCommentItemResponse {
  username?: string;
  email?: string;
  /** @format date-time */
  createdAt?: string;
  content?: string;
  comment?: string;
}

export interface ApiResponseListCheckListItemResponse {
  code?: string;
  msg?: string;
  data?: CheckListItemResponse[];
}
