#pragma once

#include <AppSpecsJSI.h>
#include <memory>
#include <string>
#include "Int64.h"

namespace facebook::react {

class NativeSampleModule : public NativeSampleModuleCxxSpec<NativeSampleModule> {
public:
  NativeSampleModule(std::shared_ptr<CallInvoker> jsInvoker);

  std::string reverseString(jsi::Runtime& rt, std::string input);
  int32_t cubicRoot(jsi::Runtime& rt, int64_t input);
};

} // namespace facebook::react
