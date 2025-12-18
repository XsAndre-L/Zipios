// import {
//   BuildType,
//   OUTPUT_DIR,
// } from "../../../../src/core/types/package-config.ts";
// import { runPackageAction } from "../../../../src/commands/packages.ts";

import {
  BuildType,
  CPP_OUTPUT_DIR,
  runPackageAction,
  CMAKE_TOOLS,
  getHostSysrootPath,
  SYSROOT,
  PACKAGE_DIR,
} from "../../../../src/providers/package.privider.ts";

import { join } from "node:path";
import { argv } from "node:process";

export const build = (cwd: string = process.cwd()): BuildType => {
  const { windows_x86_64, windows_aarch64, linux_x86_64, linux_aarch64 } =
    SYSROOT;

  const HOST_SYSROOT = getHostSysrootPath();
  const CLANG = join(HOST_SYSROOT, "bin/clang.exe").replace(/\\/g, "/");
  const CLANGXX = join(HOST_SYSROOT, "bin/clang++.exe").replace(/\\/g, "/");

  const COMMON_FLAGS = `\
  -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_CXX_STANDARD=20 \
  -DBUILD_SHARED_LIBS=OFF \
  -DBUILD_TOOLS=OFF \
  -DBUILD_ZIPIOS_TESTS=OFF \
  -DZIPIOS_BUILD_TOOLS=OFF \
  -DZIPIOS_INSTALL_TOOLS=OFF`;

  return {
    type: "architectures",
    windows_x86_64: {
      configStep: `cmake -S . -B build/windows/x86_64 -G Ninja \
      ${COMMON_FLAGS} \
      -DCMAKE_C_COMPILER=${CLANG} \
      -DCMAKE_CXX_COMPILER=${CLANGXX} \
      -DCMAKE_C_COMPILER_TARGET=x86_64-w64-windows-gnu \
      -DCMAKE_CXX_COMPILER_TARGET=x86_64-w64-windows-gnu \
      -DCMAKE_C_FLAGS="-DZIPIOS_WINDOWS" \
      -DCMAKE_CXX_FLAGS="-DZIPIOS_WINDOWS" \
      -DCMAKE_POLICY_DEFAULT_CMP0074=NEW \
      -DZLIB_USE_STATIC_LIBS=ON \
      -DZLIB_INCLUDE_DIR=${CPP_OUTPUT_DIR}/zlib/windows/x86_64/include \
      -DZLIB_LIBRARY=${CPP_OUTPUT_DIR}/zlib/windows/x86_64/lib/libzlibstatic.a \
      -DZLIB_ROOT=${CPP_OUTPUT_DIR}/zlib/windows/x86_64 \
      -DCMAKE_PREFIX_PATH=${CPP_OUTPUT_DIR}/zlib/windows/x86_64 \
      -DCMAKE_INSTALL_PREFIX=${CPP_OUTPUT_DIR}/zipios/windows/x86_64
      `,
      buildStep: `cmake --build build/windows/x86_64 -j --target zipios`,
      installStep: `cmake --install build/windows/x86_64`,
    },
    windows_aarch64: {
      configStep: `cmake -S . -B build/windows/aarch64 -G Ninja \
      ${COMMON_FLAGS} \
      -DCMAKE_C_COMPILER=${CLANG} \
      -DCMAKE_CXX_COMPILER=${CLANGXX} \
      -DCMAKE_RC_FLAGS=--target=aarch64-w64-mingw32 \
      -DCMAKE_C_COMPILER_TARGET=aarch64-w64-windows-gnu \
      -DCMAKE_CXX_COMPILER_TARGET=aarch64-w64-windows-gnu \
      -DCMAKE_SYSTEM_NAME=Windows \
      -DCMAKE_C_FLAGS="-DZIPIOS_WINDOWS" \
      -DCMAKE_CXX_FLAGS="-DZIPIOS_WINDOWS" \
      -DCMAKE_POLICY_DEFAULT_CMP0074=NEW \
      -DZLIB_USE_STATIC_LIBS=ON \
      -DZLIB_INCLUDE_DIR=${CPP_OUTPUT_DIR}/zlib/windows/x86_64/include \
      -DZLIB_LIBRARY=${CPP_OUTPUT_DIR}/zlib/windows/aarch64/lib/libzlibstatic.a \
      -DZLIB_ROOT=${CPP_OUTPUT_DIR}/zlib/windows/aarch64/zlib \
      -DCMAKE_PREFIX_PATH=${CPP_OUTPUT_DIR}/zlib/windows/aarch64 \
      -DCMAKE_INSTALL_PREFIX=${CPP_OUTPUT_DIR}/zipios/windows/aarch64
      `,
      buildStep: `cmake --build build/windows/aarch64 -j --target zipios`,
      installStep: `cmake --install build/windows/aarch64`,
    },
    linux_x86_64: {
      configStep: `cmake -S . -B build/linux/x86_64 -G Ninja \
      -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLS}/linux_x86-64.cmake \
      ${COMMON_FLAGS} \
      -DCMAKE_C_COMPILER=${CLANG} \
      -DCMAKE_CXX_COMPILER=${CLANGXX} \
      -DCMAKE_C_COMPILER_TARGET=x86_64-unknown-linux-gnu \
      -DCMAKE_CXX_COMPILER_TARGET=x86_64-unknown-linux-gnu \
      -DCMAKE_POLICY_DEFAULT_CMP0074=NEW \
      -DZLIB_USE_STATIC_LIBS=ON \
      -DZLIB_INCLUDE_DIR=${CPP_OUTPUT_DIR}/zlib/linux/x86_64/include \
      -DZLIB_LIBRARY=${CPP_OUTPUT_DIR}/zlib/linux/x86_64/lib/libzlibstatic.a \
      -DZLIB_ROOT=${CPP_OUTPUT_DIR}/zlib/linux/x86_64 \
      -DCMAKE_PREFIX_PATH=${CPP_OUTPUT_DIR}/zlib/linux/x86_64 \
      -DCMAKE_INSTALL_PREFIX=${CPP_OUTPUT_DIR}/zipios/linux/x86_64
      `,
      buildStep: `cmake --build build/linux/x86_64 -j --target zipios`,
      installStep: `cmake --install build/linux/x86_64`,
    },
    linux_aarch64: {
      configStep: `cmake -S . -B build/linux/aarch64 -G Ninja \
      -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLS}/linux_aarch64.cmake \
      ${COMMON_FLAGS} \
      -DCMAKE_C_COMPILER=${CLANG} \
      -DCMAKE_CXX_COMPILER=${CLANGXX} \
      -DCMAKE_C_COMPILER_TARGET=aarch64-unknown-linux-gnu \
      -DCMAKE_CXX_COMPILER_TARGET=aarch64-unknown-linux-gnu \
      -DCMAKE_POLICY_DEFAULT_CMP0074=NEW \
      -DZLIB_USE_STATIC_LIBS=ON \
      -DZLIB_INCLUDE_DIR=${CPP_OUTPUT_DIR}/zlib/linux/aarch64/include \
      -DZLIB_LIBRARY=${CPP_OUTPUT_DIR}/zlib/linux/aarch64/lib/libzlibstatic.a \
      -DZLIB_ROOT=${CPP_OUTPUT_DIR}/zlib/linux/aarch64 \
      -DCMAKE_PREFIX_PATH=${CPP_OUTPUT_DIR}/zlib/linux/aarch64 \
      -DCMAKE_INSTALL_PREFIX=${CPP_OUTPUT_DIR}/zipios/linux/aarch64
      `,
      buildStep: `cmake --build build/linux/aarch64 -j --target zipios`,
      installStep: `cmake --install build/linux/aarch64`,
    },
  } satisfies BuildType;
};

const args = argv.slice(2);
const [action = "help"] = args;

await runPackageAction(action, process.cwd(), build());
