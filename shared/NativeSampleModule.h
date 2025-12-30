#pragma once

#include <AppSpecsJSI.h>
#include <memory>
#include <string>
#include "Int64.h"

namespace facebook::react {

using Address = NativeSampleModuleAddress<std::string, int32_t, bool>;

template <>
struct Bridging<Address>
  : NativeSampleModuleAddressBridging<Address> {};

class NativeSampleModule : public NativeSampleModuleCxxSpec<NativeSampleModule> {
public:
  NativeSampleModule(std::shared_ptr<CallInvoker> jsInvoker);

  std::string reverseString(jsi::Runtime& rt, std::string input);
  int32_t cubicRoot(jsi::Runtime& rt, int64_t input);
  bool validateAddress(jsi::Runtime &rt, jsi::Object input);
};

} // namespace facebook::react
