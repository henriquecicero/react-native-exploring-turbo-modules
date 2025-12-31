#import "RCTNativeCounterView.h"
#import <react/renderer/components/AppSpecs/ComponentDescriptors.h>
#import <react/renderer/components/AppSpecs/EventEmitters.h>
#import <react/renderer/components/AppSpecs/Props.h>
#import <react/renderer/components/AppSpecs/RCTComponentViewHelpers.h>

using namespace facebook::react;

@interface RCTNativeCounterView () <RCTNativeCounterViewViewProtocol>
@end

@implementation RCTNativeCounterView {
  UILabel *_labelView;
  NSInteger _count;
  NSString *_label;
}

- (instancetype)init
{
  if (self = [super init]) {
    _labelView = [UILabel new];
    _labelView.textAlignment = NSTextAlignmentCenter;
    _labelView.numberOfLines = 1;
    _labelView.font = [UIFont systemFontOfSize:16 weight:UIFontWeightSemibold];
    [self addSubview:_labelView];

    UITapGestureRecognizer *tap =
      [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(handleTap)];
    [self addGestureRecognizer:tap];

    _count = 0;
    _label = @"";
    [self updateLabelText];
  }
  return self;
}

- (void)handleTap
{
  _count += 1;
  [self updateLabelText];
  NativeCounterViewEventEmitter::OnPress event =
    NativeCounterViewEventEmitter::OnPress{(double)_count};
  self.eventEmitter.onPress(event);
}

- (void)updateLabelText
{
  NSString *title = _label.length > 0 ? _label : @"Count";
  _labelView.text = [NSString stringWithFormat:@"%@: %ld", title, (long)_count];
}

- (const NativeCounterViewEventEmitter &)eventEmitter
{
  return static_cast<const NativeCounterViewEventEmitter &>(*_eventEmitter);
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldViewProps =
    *std::static_pointer_cast<NativeCounterViewProps const>(_props);
  const auto &newViewProps =
    *std::static_pointer_cast<NativeCounterViewProps const>(props);

  if (oldViewProps.count != newViewProps.count) {
    _count = (NSInteger)newViewProps.count;
  }

  if (oldViewProps.label != newViewProps.label) {
    _label = [NSString stringWithCString:newViewProps.label.c_str()
                                encoding:NSUTF8StringEncoding];
  }

  [self updateLabelText];
  [super updateProps:props oldProps:oldProps];
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  _labelView.frame = self.bounds;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NativeCounterViewComponentDescriptor>();
}

@end
