import React from "react";
import { Section } from "@/components/note-assist/section";
import { SearchResults } from "@/components/note-assist/search-results";
import { SearchResults as SearchResultsType } from "@/lib/types";

interface RetrieveSectionProps {
  data: SearchResultsType;
}

const RetrieveSection: React.FC<RetrieveSectionProps> = ({ data }) => {
  return (
    <Section title="Sources">
      <SearchResults results={data.results} />
    </Section>
  );
};

export default RetrieveSection;
