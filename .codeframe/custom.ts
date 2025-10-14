import {
  BuildArchitectures,
  OUTPUT_DIR,
} from "../../../src/types/package-config.ts";

import { resolve, join } from "node:path";

export const builds = (cwd: string): BuildArchitectures => {
  const toolchain = resolve(cwd, "../../toolchains/llvm-mingw");
  const CLANG = join(toolchain, "bin/clang.exe").replace(/\\/g, "/");
  const CLANGXX = join(toolchain, "bin/clang++.exe").replace(/\\/g, "/");
  const WINDRES = join(toolchain, "bin/llvm-windres.exe").replace(/\\/g, "/");
  const AARCH64_WINDRES = join(
    toolchain,
    "bin/aarch64-w64-mingw32-windres.exe"
  ).replace(/\\/g, "/");

  const localtime_shim = resolve(cwd, ".codeframe/localtime_shim.hpp");

  return {
    windows_x86_64: {
      configStep: `cmake -S . -B build/build-x86_64 -G Ninja \
      -DCMAKE_CXX_FLAGS:STRING="-include=D:/Dev/codeframe-docs/CodeFramePackages/shims/localtime_shim.hpp;-Wno-macro-redefined" \
      -DCMAKE_BUILD_TYPE=Release \
      -DBUILD_SHARED_LIBS:BOOL=OFF \
      -DBUILD_TOOLS=OFF \
      -DBUILD_ZIPIOS_TESTS:BOOL=OFF \
      -DZIPIOS_BUILD_TOOLS=OFF \
      -DZIPIOS_INSTALL_TOOLS=OFF \
      -DCMAKE_C_COMPILER=${CLANG} \
      -DCMAKE_CXX_COMPILER=${CLANGXX} \
      -DCMAKE_RC_COMPILER=${WINDRES} \
      -DCMAKE_C_COMPILER_TARGET=x86_64-w64-windows-gnu \
      -DCMAKE_CXX_COMPILER_TARGET=x86_64-w64-windows-gnu \
      -DCMAKE_CXX_STANDARD=20 \
      -DCMAKE_POLICY_DEFAULT_CMP0074=NEW \
      -DZLIB_USE_STATIC_LIBS=ON \
      -DZLIB_INCLUDE_DIR=${OUTPUT_DIR}/windows/x86_64/zlib/include \
      -DZLIB_LIBRARY=${OUTPUT_DIR}/windows/x86_64/zlib/lib/libzlibstatic.a \
      -DZLIB_ROOT=${OUTPUT_DIR}/windows/x86_64/zlib \
      -DCMAKE_PREFIX_PATH=${OUTPUT_DIR}/windows/x86_64/zlib \
      -DCMAKE_INSTALL_PREFIX=${OUTPUT_DIR}/windows/x86_64/zipios
      `,

      buildStep: `cmake --build build/build-x86_64 -j --target zipios`,
      installStep: `cmake --install build/build-x86_64`,
    },
    windows_aarch64: {
      configStep: `cmake -S . -B build/build-aarch64 -G Ninja \
      -DCMAKE_BUILD_TYPE=Release \
      -DBUILD_SHARED_LIBS:BOOL=OFF \
      -DBUILD_TOOLS=OFF \
      -DBUILD_ZIPIOS_TESTS:BOOL=OFF \
      -DZIPIOS_BUILD_TOOLS=OFF \
      -DZIPIOS_INSTALL_TOOLS=OFF \
      -DCMAKE_C_COMPILER=${CLANG} \
      -DCMAKE_CXX_COMPILER=${CLANGXX} \
      -DCMAKE_RC_COMPILER=${AARCH64_WINDRES} \
      -DCMAKE_RC_FLAGS=--target=aarch64-w64-mingw32 \
      -DCMAKE_C_COMPILER_TARGET=aarch64-w64-windows-gnu \
      -DCMAKE_CXX_COMPILER_TARGET=aarch64-w64-windows-gnu \
      -DCMAKE_SYSTEM_NAME=Windows \
      -DCMAKE_CXX_STANDARD=20 \
      -DCMAKE_POLICY_DEFAULT_CMP0074=NEW \
      -DZLIB_USE_STATIC_LIBS=ON \
      -DCMAKE_SYSTEM_PROCESSOR=aarch64 \
      -DZLIB_INCLUDE_DIR=${OUTPUT_DIR}/windows/aarch64/zlib/include \
      -DZLIB_LIBRARY=${OUTPUT_DIR}/windows/aarch64/zlib/lib/libzlibstatic.a \
      -DZLIB_ROOT=${OUTPUT_DIR}/windows/aarch64/zlib \
      -DCMAKE_PREFIX_PATH=${OUTPUT_DIR}/windows/aarch64/zlib \
      -DCMAKE_INSTALL_PREFIX=${OUTPUT_DIR}/windows/aarch64/zipios
      `,
      buildStep: `cmake --build build/build-aarch64 -j --target zipios`,
      installStep: `cmake --install build/build-aarch64`,
    },
  } satisfies BuildArchitectures;
};

// -DCMAKE_SYSTEM_NAME=Windows \

// -DZLIB_INCLUDE_DIR=D:/Dev/Libs/zlib/aarch64/include \
// -DZLIB_LIBRARY=D:/Dev/Libs/zlib/aarch64/lib/libzs.a \
// -DZLIB_ROOT=D:/Dev/Libs/zlib/aarch64 \
// -DCMAKE_PREFIX_PATH=D:/Dev/Libs/zlib/aarch64 \
// -DCMAKE_INSTALL_PREFIX=D:/Dev/Libs/zipios/aarch64
