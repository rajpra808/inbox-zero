import { PageHeaderVideoButton } from "@/components/PageHeaderVideoButton";
import { PageHeading, PageSubHeading } from "@/components/Typography";

type Video = {
  title: string;
  description: React.ReactNode;
  youtubeVideoId?: string;
  muxPlaybackId?: string;
};

interface PageHeaderProps {
  description?: string;
  title: string;
  video?: Video;
}

export function PageHeader({ title, video, description }: PageHeaderProps) {
  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="max-w-2xl">
        <PageHeading className="text-2xl lg:text-3xl">{title}</PageHeading>
        {description && (
          <PageSubHeading className="mt-2 text-[15px] leading-relaxed">
            {description}
          </PageSubHeading>
        )}
      </div>
      {video && (video.youtubeVideoId || video.muxPlaybackId) && (
        <PageHeaderVideoButton video={video} />
      )}
    </div>
  );
}
