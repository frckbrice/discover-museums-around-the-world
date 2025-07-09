import { Timeline } from "@/types/Timeline";

interface TimelineDisplayProps {
  timeline: Timeline;
}

export default function TimelineDisplay({ timeline }: TimelineDisplayProps) {
  return (
    <div className="bg-white rounded-lg border border-muted p-6">
      <h3 className="text-2xl font-playfair font-bold text-primary mb-4">
        {timeline.title}
      </h3>
      
      {timeline.description && (
        <p className="text-muted-foreground mb-6">{timeline.description}</p>
      )}
      
      <div className="relative">
        {timeline.timelinePoints.map((point, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-dot top-0"></div>
            <h4 className="font-bold text-primary">
              {point.date} - {point.title}
            </h4>
            <p className="text-muted-foreground">{point.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
