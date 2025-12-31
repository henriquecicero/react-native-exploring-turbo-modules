#import <Foundation/Foundation.h>
#import <AppSpecs/AppSpecs.h>
#import <React/RCTInitializing.h>
#import <React/RCTInvalidating.h>


NS_ASSUME_NONNULL_BEGIN

@interface NativeLocalStorageProvider : NativeLocalStorageSpecBase <NativeLocalStorageSpec, RCTInitializing, RCTInvalidating>

@end

NS_ASSUME_NONNULL_END
