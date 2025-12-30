#import "NativeLocalStorageProvider.h"

static NSString *const NativeLocalStorageProviderKey = @"local-storage";

@interface NativeLocalStorageProvider()
@property (strong, nonatomic) NSUserDefaults *localStorage;
@end

@implementation NativeLocalStorageProvider

- (id) init {
  if (self = [super init]) {
    _localStorage = [[NSUserDefaults alloc] initWithSuiteName:NativeLocalStorageProviderKey];
  }
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeLocalStorageSpecJSI>(params);
}

- (NSString * _Nullable)getItem:(NSString *)key {
  return [self.localStorage stringForKey:key];
}

- (void)setItem:(NSString *)value
            key:(NSString *)key {
  BOOL shouldEmitEvent = NO;
  if (![self getItem:key]) {
    shouldEmitEvent = YES;
  }
  
  [self.localStorage setObject:value forKey:key];
  if (shouldEmitEvent) {
    [self emitOnKeyAdded:@{@"key": key, @"value": value}];
  }
  
}

- (void)removeItem:(NSString *)key {
  [self.localStorage removeObjectForKey:key];
}

- (void)clear {
  NSDictionary *keys = [self.localStorage dictionaryRepresentation];
  for (NSString *key in keys) {
    [self removeItem:key];
  }
}

+ (NSString *)moduleName
{
  return @"NativeLocalStorage";
}

@end
