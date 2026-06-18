import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export type MorningBriefEmailItem = {
  accountEmail: string;
  from: string;
  subject: string;
  summary: string;
  importanceScore: number;
  category: string | null;
  actionNeeded: boolean;
};

export type MorningBriefEmailProps = {
  baseUrl: string;
  unsubscribeToken: string;
  emailAccountId: string;
  date?: Date;
  executiveSummary: string;
  items: MorningBriefEmailItem[];
};

export default function MorningBriefEmail(props: MorningBriefEmailProps) {
  const {
    baseUrl = "https://www.getinboxzero.com",
    unsubscribeToken,
    emailAccountId,
    executiveSummary,
    items = [],
  } = props;

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto w-full max-w-[600px] p-0">
            <Section className="p-4 text-center">
              <Link href={baseUrl} className="text-[15px]">
                <Img
                  src="https://www.getinboxzero.com/icon.png"
                  width="40"
                  height="40"
                  alt="Inbox Zero"
                  className="mx-auto my-0"
                />
              </Link>
              <Text className="mx-0 mb-8 mt-4 p-0 text-center text-2xl font-normal">
                <span className="font-semibold tracking-tighter">
                  Inbox Zero
                </span>
              </Text>
              <Heading className="my-4 text-4xl font-medium leading-tight">
                Your Morning Brief
              </Heading>
              <Text className="mb-8 text-lg leading-8">
                Here's what needs your attention across all your inboxes.
              </Text>
            </Section>

            <Section className="mb-6 px-4">
              <div className="rounded-[8px] border border-solid border-gray-200 bg-[#fdfefe] p-4">
                <Text className="mt-0 mb-0 text-[15px] leading-[1.6] text-gray-800">
                  {executiveSummary}
                </Text>
              </div>
            </Section>

            {items.length > 0 ? (
              <Section className="px-4">
                {items.map((item, index) => (
                  <div key={index}>
                    <div className="mb-[12px] rounded-[8px] border border-solid border-gray-200 p-[16px]">
                      <div className="mb-[6px] flex items-center gap-2">
                        {item.actionNeeded ? (
                          <span className="rounded bg-red-50 px-2 py-[2px] text-[11px] font-semibold text-red-700">
                            Action needed
                          </span>
                        ) : null}
                        <span className="rounded bg-gray-100 px-2 py-[2px] text-[11px] text-gray-600">
                          {item.accountEmail}
                        </span>
                        {item.category ? (
                          <span className="rounded bg-blue-50 px-2 py-[2px] text-[11px] text-blue-700">
                            {item.category}
                          </span>
                        ) : null}
                      </div>
                      <Text className="mt-0 mb-[2px] text-[15px] font-bold text-gray-900">
                        {item.subject}
                      </Text>
                      <Text className="mt-0 mb-[4px] text-[13px] text-gray-600">
                        From: {item.from}
                      </Text>
                      <Text className="mt-0 mb-0 text-[14px] leading-[1.5] text-gray-800">
                        {item.summary}
                      </Text>
                    </div>
                  </div>
                ))}
              </Section>
            ) : (
              <Section className="mb-8 text-center">
                <Text className="text-lg text-gray-500">
                  Nothing needs your attention today. Enjoy your morning!
                </Text>
              </Section>
            )}

            <Hr className="my-[24px] border-solid border-gray-200" />
            <Section className="mt-8 text-center text-sm text-gray-500">
              <Text className="m-0">
                You're receiving this because you enabled Morning Brief in your
                Inbox Zero settings.
              </Text>
              <div className="mt-[8px]">
                <Link
                  href={`${baseUrl}/api/unsubscribe?token=${unsubscribeToken}`}
                  className="mr-[16px] text-gray-500 underline"
                >
                  Unsubscribe
                </Link>
                <Link
                  href={`${baseUrl}/${emailAccountId}/morning-brief`}
                  className="text-gray-500 underline"
                >
                  Customize
                </Link>
              </div>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

MorningBriefEmail.PreviewProps = {
  baseUrl: "https://www.getinboxzero.com",
  unsubscribeToken: "123",
  emailAccountId: "123",
  executiveSummary:
    "Two emails need replies today: a client question about the latest deliverable and an HR request to schedule your annual review. The rest can wait.",
  items: [
    {
      accountEmail: "work@example.com",
      from: "Client XYZ",
      subject: "Questions about the latest deliverable",
      summary:
        "Client needs clarification on two points in the deliverable before Friday.",
      importanceScore: 0.9,
      category: "To Reply",
      actionNeeded: true,
    },
    {
      accountEmail: "work@example.com",
      from: "HR Department",
      subject: "Annual review scheduling",
      summary: "Pick a time slot for your annual review next week.",
      importanceScore: 0.7,
      category: "To Reply",
      actionNeeded: true,
    },
    {
      accountEmail: "personal@example.com",
      from: "Amazon",
      subject: "Order delivered",
      summary: "Your order has been delivered to your doorstep.",
      importanceScore: 0.1,
      category: "Receipt",
      actionNeeded: false,
    },
  ],
};
