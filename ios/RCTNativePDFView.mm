#import "RCTNativePDFView.h"
#import <PDFKit/PDFKit.h>
#import <react/renderer/components/AppSpecs/ComponentDescriptors.h>
#import <react/renderer/components/AppSpecs/EventEmitters.h>
#import <react/renderer/components/AppSpecs/Props.h>
#import <react/renderer/components/AppSpecs/RCTComponentViewHelpers.h>

using namespace facebook::react;

@interface RCTNativePDFView () <RCTNativePDFViewViewProtocol>
@end

@implementation RCTNativePDFView {
  PDFView *_pdfView;
  NSURLSessionDataTask *_downloadTask;
  NSUInteger _loadToken;
  NSInteger _page;
  double _scale;
  BOOL _pagingEnabled;
  CGFloat _defaultMinScale;
  CGFloat _defaultMaxScale;
}

- (instancetype)init
{
  if (self = [super init]) {
    _pdfView = [PDFView new];
    _pdfView.displayMode = kPDFDisplaySinglePageContinuous;
    _pdfView.displayDirection = kPDFDisplayDirectionVertical;
    [_pdfView usePageViewController:NO withViewOptions:nil];
    _pdfView.autoScales = YES;
    _defaultMinScale = _pdfView.minScaleFactor;
    _defaultMaxScale = _pdfView.maxScaleFactor;
    [self addSubview:_pdfView];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(handlePageChanged:)
                                                 name:PDFViewPageChangedNotification
                                               object:_pdfView];

    _page = 0;
    _scale = 0.0;
    _pagingEnabled = NO;
    _loadToken = 0;
  }
  return self;
}

- (void)dealloc
{
  [self cancelDownload];
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)cancelDownload
{
  if (_downloadTask) {
    [_downloadTask cancel];
    _downloadTask = nil;
  }
}

- (void)handlePageChanged:(NSNotification *)notification
{
  [self emitPageChangedEvent];
}

- (NSInteger)currentPageIndex
{
  PDFDocument *document = _pdfView.document;
  if (!document) {
    return 0;
  }
  PDFPage *currentPage = _pdfView.currentPage;
  if (!currentPage) {
    return 0;
  }
  NSUInteger index = [document indexForPage:currentPage];
  if (index == NSNotFound) {
    return 0;
  }
  return (NSInteger)index;
}

- (NSInteger)clampedPageIndex:(NSInteger)pageIndex
{
  PDFDocument *document = _pdfView.document;
  if (!document) {
    return 0;
  }
  NSInteger pageCount = document.pageCount;
  if (pageCount <= 0) {
    return 0;
  }
  if (pageIndex < 0) {
    return 0;
  }
  if (pageIndex >= pageCount) {
    return pageCount - 1;
  }
  return pageIndex;
}

- (void)applyPagingMode
{
  if (_pagingEnabled) {
    _pdfView.displayMode = kPDFDisplaySinglePage;
    _pdfView.displayDirection = kPDFDisplayDirectionHorizontal;
    [_pdfView usePageViewController:YES withViewOptions:nil];
  } else {
    _pdfView.displayMode = kPDFDisplaySinglePageContinuous;
    _pdfView.displayDirection = kPDFDisplayDirectionVertical;
    [_pdfView usePageViewController:NO withViewOptions:nil];
  }
}

- (void)applyScale
{
  if (_scale <= 0.0) {
    _pdfView.minScaleFactor = _defaultMinScale;
    _pdfView.maxScaleFactor = _defaultMaxScale;
    _pdfView.autoScales = YES;
    return;
  }
  _pdfView.autoScales = NO;
  _pdfView.minScaleFactor = _scale;
  _pdfView.maxScaleFactor = _scale;
  _pdfView.scaleFactor = _scale;
}

- (void)applyPage
{
  PDFDocument *document = _pdfView.document;
  if (!document) {
    return;
  }
  NSInteger pageIndex = [self clampedPageIndex:_page];
  PDFPage *page = [document pageAtIndex:pageIndex];
  if (!page) {
    return;
  }
  [_pdfView goToPage:page];
}

- (void)emitLoadEvent
{
  PDFDocument *document = _pdfView.document;
  if (!document) {
    return;
  }
  NSInteger pageCount = document.pageCount;
  NSInteger pageIndex = [self currentPageIndex];
  NativePDFViewEventEmitter::OnLoad event;
  event.pageCount = (int32_t)pageCount;
  event.page = (int32_t)pageIndex;
  self.eventEmitter.onLoad(event);
}

- (void)emitPageChangedEvent
{
  PDFDocument *document = _pdfView.document;
  if (!document) {
    return;
  }
  NSInteger pageIndex = [self currentPageIndex];
  NativePDFViewEventEmitter::OnPageChanged event;
  event.page = (int32_t)pageIndex;
  self.eventEmitter.onPageChanged(event);
}

- (void)emitErrorWithMessage:(NSString *)message code:(NSString *)code
{
  NativePDFViewEventEmitter::OnError event;
  event.message = std::string([message UTF8String]);
  event.code = std::string([code UTF8String]);
  self.eventEmitter.onError(event);
}

- (void)applyDocument:(PDFDocument *)document
{
  _pdfView.document = document;
  [self applyPagingMode];
  [self applyScale];
  [self applyPage];
  [self emitLoadEvent];
}

- (void)loadLocalDocument:(NSURL *)fileURL
{
  PDFDocument *document = [[PDFDocument alloc] initWithURL:fileURL];
  if (!document) {
    [self emitErrorWithMessage:@"Failed to load PDF document." code:@"E_PDF_PARSE"];
    return;
  }
  [self applyDocument:document];
}

- (void)loadRemoteDocument:(NSURL *)remoteURL token:(NSUInteger)token
{
  __weak __typeof__(self) weakSelf = self;
  _downloadTask = [[NSURLSession sharedSession]
    dataTaskWithURL:remoteURL
    completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
      dispatch_async(dispatch_get_main_queue(), ^{
        __strong __typeof__(weakSelf) strongSelf = weakSelf;
        if (!strongSelf) {
          return;
        }
        if (token != strongSelf->_loadToken) {
          return;
        }
        strongSelf->_downloadTask = nil;
        if (error) {
          [strongSelf emitErrorWithMessage:error.localizedDescription ?: @"Failed to download PDF."
                                      code:@"E_DOWNLOAD"];
          return;
        }
        if (!data || data.length == 0) {
          [strongSelf emitErrorWithMessage:@"Empty PDF response." code:@"E_EMPTY_RESPONSE"];
          return;
        }
        PDFDocument *document = [[PDFDocument alloc] initWithData:data];
        if (!document) {
          [strongSelf emitErrorWithMessage:@"Failed to parse PDF data." code:@"E_PDF_PARSE"];
          return;
        }
        [strongSelf applyDocument:document];
      });
    }];
  [_downloadTask resume];
}

- (void)loadSourceURLString:(NSString *)urlString
{
  [self cancelDownload];
  _loadToken += 1;
  NSUInteger token = _loadToken;

  if (urlString.length == 0) {
    _pdfView.document = nil;
    return;
  }

  NSURL *url = [NSURL URLWithString:urlString];
  if (!url) {
    [self emitErrorWithMessage:@"Invalid URL." code:@"E_INVALID_URL"];
    return;
  }

  if (url.isFileURL) {
    [self loadLocalDocument:url];
    return;
  }

  if (url.scheme == nil) {
    NSURL *fileURL = [NSURL fileURLWithPath:urlString];
    [self loadLocalDocument:fileURL];
    return;
  }

  NSString *scheme = url.scheme.lowercaseString;
  if ([scheme isEqualToString:@"http"] || [scheme isEqualToString:@"https"]) {
    [self loadRemoteDocument:url token:token];
    return;
  }

  [self emitErrorWithMessage:@"Unsupported URL scheme." code:@"E_UNSUPPORTED_SCHEME"];
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldViewProps =
    *std::static_pointer_cast<NativePDFViewProps const>(_props);
  const auto &newViewProps =
    *std::static_pointer_cast<NativePDFViewProps const>(props);

  if (oldViewProps.sourceURL != newViewProps.sourceURL) {
    NSString *urlString =
      [NSString stringWithCString:newViewProps.sourceURL.c_str()
                         encoding:NSUTF8StringEncoding];
    if (urlString) {
      [self loadSourceURLString:urlString];
    } else {
      [self emitErrorWithMessage:@"Invalid URL." code:@"E_INVALID_URL"];
    }
  }

  if (oldViewProps.page != newViewProps.page) {
    _page = (NSInteger)newViewProps.page;
    [self applyPage];
  }

  if (oldViewProps.scale != newViewProps.scale) {
    _scale = newViewProps.scale;
    [self applyScale];
  }

  if (oldViewProps.pagingEnabled != newViewProps.pagingEnabled) {
    _pagingEnabled = newViewProps.pagingEnabled;
    [self applyPagingMode];
    [self applyPage];
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  _pdfView.frame = self.bounds;
}

- (const NativePDFViewEventEmitter &)eventEmitter
{
  return static_cast<const NativePDFViewEventEmitter &>(*_eventEmitter);
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NativePDFViewComponentDescriptor>();
}

@end
