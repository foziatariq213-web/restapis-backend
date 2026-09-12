<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Attendance extends Model
{
    protected $fillable = [
        'employee_id',
        'attendance_date',
        'check_in',
        'check_out',
        'check_in_latitude',
        'check_in_longitude',
        'check_out_latitude',
        'check_out_longitude',
        'gps_accuracy_m',
        'distance_from_office_km',
        'status',
        'deduction_percentage',
        'deduction_amount',
    ];

    protected $casts = [
        'attendance_date' => 'date',
        'check_in' => 'datetime',
        'check_out' => 'datetime',
        'employee_id' => 'integer',
        'check_in_latitude' => 'decimal:7',
        'check_in_longitude' => 'decimal:7',
        'check_out_latitude' => 'decimal:7',
        'check_out_longitude' => 'decimal:7',
        'gps_accuracy_m' => 'decimal:2',
        'distance_from_office_km' => 'decimal:3',
        'deduction_percentage' => 'decimal:2',
        'deduction_amount' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    private const VALID_STATUSES = [
        'present', 'absent', 'late', 'half_day',
        'sick_leave', 'casual_leave', 'emergency_leave',
    ];

    protected static function booted(): void
    {
        static::saving(function (Attendance $attendance) {
            self::validateEmployee($attendance);
            self::validateAttendanceDate($attendance);
            self::validateCheckInOutTimes($attendance);
            self::validateGpsCoordinates($attendance);
            self::validateDistanceAndAccuracy($attendance);
            self::validateDeductions($attendance);
            self::validateStatus($attendance);
            self::validateNoDuplicate($attendance);
        });
    }

    private static function validateEmployee(Attendance $attendance): void
    {
        if (!Employee::find($attendance->employee_id)) {
            throw new \InvalidArgumentException(
                'Invalid employee_id: Employee does not exist.'
            );
        }
    }

    private static function validateAttendanceDate(Attendance $attendance): void
    {
        if (!$attendance->attendance_date) {
            return;
        }

        if ($attendance->attendance_date > now()->toDateString()) {
            throw new \InvalidArgumentException(
                'Attendance date cannot be in the future.'
            );
        }

        if ($attendance->attendance_date < now()->subYear()) {
            throw new \InvalidArgumentException(
                'Attendance date is too old. Cannot record attendance older than 1 year.'
            );
        }
    }

    private static function validateCheckInOutTimes(Attendance $attendance): void
    {
        if (!$attendance->check_in || !$attendance->check_out) {
            return;
        }

        $checkIn = Carbon::parse($attendance->check_in);
        $checkOut = Carbon::parse($attendance->check_out);

        if ($checkOut->lte($checkIn)) {
            throw new \InvalidArgumentException(
                'Check-out time must be after check-in time.'
            );
        }

        if ($checkOut->diffInHours($checkIn) > 24) {
            throw new \InvalidArgumentException(
                'Attendance duration cannot exceed 24 hours.'
            );
        }
    }

    private static function validateGpsCoordinates(Attendance $attendance): void
    {
        if ($attendance->check_in_latitude !== null
            && ($attendance->check_in_latitude < -90 || $attendance->check_in_latitude > 90)) {
            throw new \InvalidArgumentException(
                'Check-in latitude must be between -90 and 90.'
            );
        }

        if ($attendance->check_in_longitude !== null
            && ($attendance->check_in_longitude < -180 || $attendance->check_in_longitude > 180)) {
            throw new \InvalidArgumentException(
                'Check-in longitude must be between -180 and 180.'
            );
        }

        if ($attendance->check_out_latitude !== null
            && ($attendance->check_out_latitude < -90 || $attendance->check_out_latitude > 90)) {
            throw new \InvalidArgumentException(
                'Check-out latitude must be between -90 and 90.'
            );
        }

        if ($attendance->check_out_longitude !== null
            && ($attendance->check_out_longitude < -180 || $attendance->check_out_longitude > 180)) {
            throw new \InvalidArgumentException(
                'Check-out longitude must be between -180 and 180.'
            );
        }
    }

    private static function validateDistanceAndAccuracy(Attendance $attendance): void
    {
        if ($attendance->distance_from_office_km !== null
            && ($attendance->distance_from_office_km < 0 || $attendance->distance_from_office_km > 500)) {
            throw new \InvalidArgumentException(
                'Distance from office must be between 0 and 500 km.'
            );
        }

        if ($attendance->gps_accuracy_m !== null && $attendance->gps_accuracy_m < 0) {
            throw new \InvalidArgumentException(
                'GPS accuracy cannot be negative.'
            );
        }
    }

    private static function validateDeductions(Attendance $attendance): void
    {
        if ($attendance->deduction_percentage !== null
            && ($attendance->deduction_percentage < 0 || $attendance->deduction_percentage > 100)) {
            throw new \InvalidArgumentException(
                'Deduction percentage must be between 0 and 100.'
            );
        }

        if ($attendance->deduction_amount !== null && $attendance->deduction_amount < 0) {
            throw new \InvalidArgumentException(
                'Deduction amount cannot be negative.'
            );
        }
    }

    private static function validateStatus(Attendance $attendance): void
    {
        if ($attendance->status && !in_array($attendance->status, self::VALID_STATUSES, true)) {
            throw new \InvalidArgumentException(
                'Invalid status. Must be one of: ' . implode(', ', self::VALID_STATUSES)
            );
        }
    }

    private static function validateNoDuplicate(Attendance $attendance): void
    {
        $duplicate = static::where('employee_id', $attendance->employee_id)
            ->where('attendance_date', $attendance->attendance_date)
            ->where('id', '!=', $attendance->id)
            ->exists();

        if ($duplicate) {
            throw new \InvalidArgumentException(
                'Attendance already recorded for this employee on this date.'
            );
        }
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}