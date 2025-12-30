#include "NativeSampleModule.h"
#include <cmath>


namespace facebook::react {

NativeSampleModule::NativeSampleModule(std::shared_ptr<CallInvoker> jsInvoker)
    : NativeSampleModuleCxxSpec(std::move(jsInvoker)) {}

std::string NativeSampleModule::reverseString(jsi::Runtime& rt, std::string input) {
  return std::string(input.rbegin(), input.rend());
}

int32_t NativeSampleModule::cubicRoot(jsi::Runtime& rt, int64_t input) {
  return std::cbrt(input);
}

bool NativeSampleModule::validateAddress(jsi::Runtime &rt, jsi::Object input) {
  std::string street = input.getProperty(rt, "street").asString(rt).utf8(rt);
  int32_t number = input.getProperty(rt, "num").asNumber();

  return !street.empty() && number > 0;
}

} // namespace facebook::react
