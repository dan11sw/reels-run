package com.main.netman.utils

import kotlin.math.pow
import kotlin.math.sqrt

object GeoMath {
    /**
     * Вычисление расстояния между двумя точками
     */
    fun distancePoint(x1: Double, y1: Double, x2: Double, y2: Double): Double {
        return sqrt((x1 - x2).pow(2) + (y1 - y2).pow(2))
    }

    /**
     * Определение пересечения окружностей
     */
    fun intersectionCircles(x1: Double, y1: Double,
                            x2: Double, y2: Double,
                            r1: Double, r2: Double): Boolean {
        return (distancePoint(x1, y1, x2, y2) < (r1 + r2))
    }

    /**
     * Определение точки в окружности
     */
    fun pointInCircles(x: Double, y: Double,
                       x0: Double, y0: Double,
                       r: Double): Boolean {
        return (((x - x0).pow(2) + (y - y0).pow(2)) <= r.pow(2))
    }

    /**
     * Вычисление радиуса окружности с учётом масштабирования
     */
    fun radiusLatLng(radius: Double) = radius / 100000
}