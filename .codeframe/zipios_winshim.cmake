# Injects our custom Windows compatibility shim globally.
add_compile_options(
  -include D:/Dev/codeframe-docs/CodeFramePackages/shims/localtime_shim.hpp
  -Wno-macro-redefined
)
