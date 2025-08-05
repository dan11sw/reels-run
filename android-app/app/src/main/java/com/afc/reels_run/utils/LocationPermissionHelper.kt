package com.afc.reels_run.utils

import android.app.Activity
import android.widget.Toast
import com.mapbox.android.core.permissions.PermissionsListener
import com.mapbox.android.core.permissions.PermissionsManager
import java.lang.ref.WeakReference

/**
 * Помощник для проверки разрешений на получение точных
 * данных местоположения устройства.
 */
class LocationPermissionHelper(val activity: WeakReference<Activity>) {
    private lateinit var permissionsManager: PermissionsManager

    fun checkPermissions(onMapReady: () -> Unit) {
        if (activity.get()?.let { PermissionsManager.areLocationPermissionsGranted(it) } == true) {
            onMapReady()
        } else {
            permissionsManager = PermissionsManager(object : PermissionsListener {
                override fun onExplanationNeeded(permissionsToExplain: List<String>) {
                    Toast.makeText(
                        activity.get(),
                        "Необходимо разрешение для получение точных данных по местоположению",
                        Toast.LENGTH_SHORT
                    ).show()
                }

                override fun onPermissionResult(granted: Boolean) {
                    if (granted) {
                        onMapReady()
                    } else {
                        activity.get()?.finish()
                    }
                }
            })

            activity.get()?.let { permissionsManager.requestLocationPermissions(it) }
        }
    }

    fun check() {
        if (activity.get()?.let { PermissionsManager.areLocationPermissionsGranted(it) } == true) {
            return
        } else {
            permissionsManager = PermissionsManager(object : PermissionsListener {
                override fun onExplanationNeeded(permissionsToExplain: List<String>) {
                    Toast.makeText(
                        activity.get(),
                        "Необходимо разрешение для получение точных данных по местоположению",
                        Toast.LENGTH_SHORT
                    ).show()
                }

                override fun onPermissionResult(granted: Boolean) {
                    if (granted) {
                        return
                    } else {
                        activity.get()?.finish()
                    }
                }
            })

            activity.get()?.let { permissionsManager.requestLocationPermissions(it) }
        }
    }

    fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        permissionsManager.onRequestPermissionsResult(requestCode, permissions, grantResults)
    }
}