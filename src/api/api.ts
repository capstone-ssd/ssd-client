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

export interface CreateDocumentParagraphRequest {
  /** @minLength 1 */
  content: string;
  /** @pattern ^#{0,6}$ */
  role: string;
  /** @format int32 */
  blockId?: number;
}

export interface UpdateDocumentRequest {
  title?: string;
  /** @minLength 1 */
  text: string;
  paragraphs?: CreateDocumentParagraphRequest[];
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

export interface EvaluatorReviewUpdateRequest {
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
  /** @minLength 1 */
  comment: string;
}

export interface ApiResponseEvaluatorReviewDetailResponse {
  code?: string;
  msg?: string;
  data?: EvaluatorReviewDetailResponse;
}

export interface EvaluatorReviewDetailResponse {
  /** @format int64 */
  reviewId?: number;
  reviewerName?: string;
  reviewerEmail?: string;
  /** @format date-time */
  changedAt?: string;
  /** @format int32 */
  feasibility?: number;
  /** @format int32 */
  differentiation?: number;
  /** @format int32 */
  financial?: number;
  /** @format double */
  totalScore?: number;
  comment?: string;
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

export interface ExternalDocumentIdRequest {
  /**
   * @minLength 1
   * @pattern ^[1-9]\d*$
   */
  docId: string;
}

export interface ApiResponseExternalAiKeywordResponse {
  code?: string;
  msg?: string;
  data?: ExternalAiKeywordResponse;
}

export interface ExternalAiKeywordResponse {
  /** @format int64 */
  documentId?: number;
  keyword?: string;
}

export interface ApiResponseExternalAiSummaryResponse {
  code?: string;
  msg?: string;
  data?: ExternalAiSummaryResponse;
}

export interface ExternalAiSummaryResponse {
  /** @format int64 */
  documentId?: number;
  summary?: string;
  shortSummary?: string;
}

export interface ApiResponseExternalAiBatchResponse {
  code?: string;
  msg?: string;
  data?: ExternalAiBatchResponse;
}

export interface ExternalAiBatchResponse {
  /** @format int64 */
  documentId?: number;
  evaluation?: ExternalAiEvaluationCardResponse;
  summary?: ExternalAiSummaryResponse;
  keyword?: ExternalAiKeywordResponse;
}

export interface ExternalAiEvaluationCardResponse {
  /** @format int64 */
  documentId?: number;
  /** @format int32 */
  totalScore?: number;
  problemRecognition?: ExternalAiEvaluationMetricResponse;
  feasibility?: ExternalAiEvaluationMetricResponse;
  growthStrategy?: ExternalAiEvaluationMetricResponse;
  businessModel?: ExternalAiEvaluationMetricResponse;
  teamComposition?: ExternalAiEvaluationMetricResponse;
  checkList?: Record<string, boolean>;
}

export interface ExternalAiEvaluationMetricResponse {
  label?: string;
  /** @format int32 */
  score?: number;
  review?: string;
}

export interface ApiResponseExternalAiEvaluationCardResponse {
  code?: string;
  msg?: string;
  data?: ExternalAiEvaluationCardResponse;
}

export interface ApiResponseExternalAiDocumentCheckResponse {
  code?: string;
  msg?: string;
  data?: ExternalAiDocumentCheckResponse;
}

export interface ExternalAiDocumentCheckResponse {
  /** @format int64 */
  documentId?: number;
  changedBlockIds?: number[];
  checkList?: Record<string, boolean>;
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

export interface CreateDocumentRequest {
  title?: string;
  /** @minLength 1 */
  text: string;
  paragraphs?: CreateDocumentParagraphRequest[];
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

export interface EvaluatorReviewCreateRequest {
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
  /** @minLength 1 */
  comment: string;
}

export interface ApiResponseEvaluatorReviewIdResponse {
  code?: string;
  msg?: string;
  data?: EvaluatorReviewIdResponse;
}

export interface EvaluatorReviewIdResponse {
  /** @format int64 */
  id?: number;
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

export interface ApiResponseExternalAiChecklistResponse {
  code?: string;
  msg?: string;
  data?: ExternalAiChecklistResponse;
}

export interface ExternalAiChecklistResponse {
  /** @format int64 */
  documentId?: number;
  checkList?: Record<string, boolean>;
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

export interface DocumentParagraphDto {
  /** @minLength 1 */
  content: string;
  /** @pattern ^#{0,6}$ */
  role: string;
  /**
   * @format int32
   * @min 1
   */
  pageNumber?: number;
  /** @format int32 */
  blockId?: number;
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

export interface ApiResponseEvaluatorReviewListResponse {
  code?: string;
  msg?: string;
  data?: EvaluatorReviewListResponse;
}

export interface EvaluatorReviewListItemResponse {
  /** @format int64 */
  reviewId?: number;
  reviewerName?: string;
  reviewerEmail?: string;
  /** @format date-time */
  changedAt?: string;
  /** @format int32 */
  feasibility?: number;
  /** @format int32 */
  differentiation?: number;
  /** @format int32 */
  financial?: number;
  /** @format double */
  totalScore?: number;
  comment?: string;
}

export interface EvaluatorReviewListResponse {
  /** @format int64 */
  documentId?: number;
  /** @format double */
  averageTotalScore?: number;
  /** @format int32 */
  reviewCount?: number;
  reviews?: EvaluatorReviewListItemResponse[];
}

export interface ApiResponseDocumentLogResponse {
  code?: string;
  msg?: string;
  data?: DocumentLogResponse;
}

export interface DocumentLogDateGroupResponse {
  savedDate?: string;
  logs?: DocumentLogItemResponse[];
}

export interface DocumentLogItemResponse {
  savedTime?: string;
  editorName?: string;
  editorEmail?: string;
  /** @format int32 */
  deletedBlockCount?: number;
  /** @format int32 */
  createdBlockCount?: number;
}

export interface DocumentLogResponse {
  /** @format int64 */
  documentId?: number;
  records?: DocumentLogDateGroupResponse[];
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
