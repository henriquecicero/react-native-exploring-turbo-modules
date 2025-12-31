#import "RCTNativeWebView.h"
#import <WebKit/WebKit.h>
#import <react/renderer/components/AppSpecs/ComponentDescriptors.h>
#import <react/renderer/components/AppSpecs/EventEmitters.h>
#import <react/renderer/components/AppSpecs/Props.h>
#import <react/renderer/components/AppSpecs/RCTComponentViewHelpers.h>

using namespace facebook::react;

@interface RCTNativeWebView () <RCTNativeWebViewViewProtocol, WKNavigationDelegate>
@end

@implementation RCTNativeWebView {
  NSURL * _sourceURL;
  WKWebView * _webView;
}

-(instancetype)init
{
  if(self = [super init]) {
    _webView = [WKWebView new];
    _webView.navigationDelegate = self;
    [self addSubview: _webView];
  }
  return self;
}

- (BOOL)urlIsValid:(std::string)propString
{
  if (propString.length() > 0 && !_sourceURL) {
    NativeWebViewEventEmitter::OnScriptLoaded result = NativeWebViewEventEmitter::OnScriptLoaded{NativeWebViewEventEmitter::OnScriptLoadedResult::Error};
    
    self.eventEmitter.onScriptLoaded(result);
    return NO;
  }
  return YES;
}

-(void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldViewProps = *std::static_pointer_cast<NativeWebViewProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<NativeWebViewProps const>(props);
  
  if (oldViewProps.sourceURL != newViewProps.sourceURL) {
    NSString *urlString = [NSString stringWithCString:newViewProps.sourceURL.c_str() encoding:NSUTF8StringEncoding];
    _sourceURL = [NSURL URLWithString:urlString];
    if ([self urlIsValid:newViewProps.sourceURL]) {
      [_webView loadRequest:[NSURLRequest requestWithURL:_sourceURL]];
    }
  }
  [super updateProps:props oldProps:oldProps];
}

-(void)layoutSubviews
{
  [super layoutSubviews];
  _webView.frame = self.bounds;
}

#pragma mark - WKNavigationDelegate

- (const NativeWebViewEventEmitter &)eventEmitter
{
  return static_cast<const NativeWebViewEventEmitter &>(*_eventEmitter);
}

-(void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation
{
  NativeWebViewEventEmitter::OnScriptLoaded result = NativeWebViewEventEmitter::OnScriptLoaded{NativeWebViewEventEmitter::OnScriptLoadedResult::Success};
  self.eventEmitter.onScriptLoaded(result);
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NativeWebViewComponentDescriptor>();
}

@end
