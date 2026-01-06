'use client';

import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import type { Platform } from "@/types";

// ============================================
// TYPES
// ============================================

interface PlatformSelectorProps {
    value: Platform;
    onChange: (platform: Platform) => void;
    disabled?: boolean;
}

// CONSTANTS

const PLATFORM_OPTIONS: ReadonlyArray<{
    value: Platform;
    label: string;
    description: string;
}> = [
    {
        value: "shopee",
        label: "Shopee",
        description: "Phí 18 - 23%",
    },
    {
        value: "tiktok",
        label: "TikTok Shop",
        description: "Phí 6 - 11%",
    },
] as const;


// COMPONENT

export function PlatformSelector({
    value,
    onChange,
    disabled
}: PlatformSelectorProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor="platform">Sàn TMĐT</Label>
            <Select
                value={value}
                onValueChange={(val) => onChange(val as Platform)}
                disabled={disabled}
            >
                <SelectTrigger id="platform" className="w-full">
                    <SelectValue placeholder="Chọn sàn" />
                </SelectTrigger>
                <SelectContent>
                    {PLATFORM_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{option.label}</span>
                                <span className="text-xs text-muted-foreground">
                                    ({option.description})
                                </span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>

            </Select>
        </div>
    )
}
