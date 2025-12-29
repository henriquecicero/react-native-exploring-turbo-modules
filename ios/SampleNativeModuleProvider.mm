//
//  SampleNativeModuleProvider.m
//  reactnativeexploringturbomodules
//
//  Created by Henrique Cícero on 29/12/2025.
//

#import "SampleNativeModuleProvider.h"
#import <ReactCommon/CallInvoker.h>
#import <ReactCommon/TurboModule.h>
#include <memory>
#import "NativeSampleModule.h"

@implementation SampleNativeModuleProvider

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::static_pointer_cast<facebook::react::TurboModule>(
      std::make_shared<facebook::react::NativeSampleModule>(params.jsInvoker));
}


@end
