# Add project specific ProGuard rules here.

# Keep React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }

# Keep React Navigation
-keep class com.swmansion.** { *; }
-keep class com.th3rdwave.** { *; }

# Keep Redux
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
    @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
}

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }