
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconColor?: string;
  className?: string;
}

const StatsCard = ({ icon, title, value, trend, iconColor = "text-primary", className }: StatsCardProps) => {
  return (
    <Card className={cn("hover:shadow-soft transition-all duration-300", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-semibold">{value}</h3>
            
            {trend && (
              <div className="flex items-center text-sm mt-2">
                <span className={trend.isPositive ? "text-medical-green" : "text-medical-red"}>
                  {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                </span>
                <span className="text-muted-foreground ml-1">vs last month</span>
              </div>
            )}
          </div>
          
          <div className={cn("rounded-full p-2 flex-shrink-0", `bg-opacity-10 bg-${iconColor.split('-')[1]}`)}>
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", `bg-opacity-20 bg-${iconColor.split('-')[1]}`)}>
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
