#pragma once
#include <ctime>

#if defined(_WIN32) || defined(__MINGW32__) || defined(__MINGW64__)
#ifndef localtime_r
// Map POSIX localtime_r() to the Windows equivalent localtime_s()
#define localtime_r(t, tm) ((localtime_s((tm), (t)) == 0) ? (tm) : nullptr)
#endif
#endif
