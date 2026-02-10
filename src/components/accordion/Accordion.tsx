import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronRight, Refresh } from '@/components/icons';

/**
 * Accordion Root Component
 * 여러 개의 AccordionItem을 감싸는 컨테이너
 *
 * @param type - 'single': 한 번에 하나만 열림 | 'multiple': 여러 개 동시에 열림
 * @param collapsible - single 모드에서 현재 열린 항목을 다시 닫을 수 있는지 여부
 * @param defaultValue - 초기 열림 상태 값
 *
 * @example
 * ```tsx
 * <Accordion.Root type="single" collapsible defaultValue="item-1">
 *   <Accordion.Item value="item-1">
 *     <Accordion.Trigger>제목</Accordion.Trigger>
 *     <Accordion.Content>내용</Accordion.Content>
 *   </Accordion.Item>
 * </Accordion.Root>
 * ```
 */
const AccordionRoot = AccordionPrimitive.Root;

AccordionRoot.displayName = 'Accordion.Root';

/**
 * Accordion Item Component
 * 개별 아코디언 항목 (Trigger + Content)
 */
export type AccordionItemProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>;

export const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={`mb-2 rounded-lg border border-gray-100 bg-white ${className || ''}`}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

/**
 * Accordion Trigger Component
 * 클릭하면 Content를 열고 닫는 버튼
 *
 * @param showRefreshIcon - 새로고침 아이콘 표시 여부
 */
export interface AccordionTriggerProps extends React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Trigger
> {
  showRefreshIcon?: boolean;
}

export const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, showRefreshIcon = false, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={`group focus-visible:ring-primary-500 flex flex-1 items-center justify-between px-5 py-4 text-[24px] leading-normal font-bold text-gray-800 transition-all hover:text-gray-600 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${className || ''}`}
      {...props}
    >
      <span className="heading-medium">{children}</span>
      <div className="flex items-center gap-2.5">
        {showRefreshIcon && (
          <Refresh className="h-[9.6px] w-[9.6px] shrink-0 text-gray-800" aria-hidden="true" />
        )}
        <ChevronRight
          className="h-2 w-2 shrink-0 items-center justify-center text-gray-800 transition-transform duration-200 group-data-[state=open]:rotate-90"
          aria-hidden="true"
        />
      </div>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = 'AccordionTrigger';

/**
 * Accordion Content Component
 * 펼쳐지는 콘텐츠 영역
 */
export type AccordionContentProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Content
>;

export const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={`data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden p-5 text-gray-700 transition-all ${className || ''}`}
    {...props}
  >
    {children}
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = 'AccordionContent';

/**
 * Accordion Namespace Export
 *
 * @example
 * ```tsx
 * <Accordion.Root type="single" collapsible>
 *   <Accordion.Item value="item-1" variant="box">
 *     <Accordion.Trigger showRefreshIcon>키워드</Accordion.Trigger>
 *     <Accordion.Content>
 *       <YourComponent />
 *     </Accordion.Content>
 *   </Accordion.Item>
 * </Accordion.Root>
 * ```
 */

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});

export default Accordion;
