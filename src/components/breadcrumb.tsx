"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getIdToNameMappings } from "@/utils/breadcrumb-helper";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

type Mappings = {
  [key: string]: string;
};

type IdToNameMapping = {
  forms: Mappings;
  users: Mappings;
  teams: Mappings;
};

const BreadCrumb = () => {
  const paths = usePathname();
  const pathNames: string[] = paths.split("/").filter((path) => path);

  const [pathNamesWithLabels, setPathNamesWithLabels] = useState<string[]>([]);
  const [idToNameMapping, setIdToNameMapping] = useState<IdToNameMapping>({
    forms: {},
    users: {},
    teams: {},
  });

  useEffect(() => {
    // Fetch mappings and set state
    async function fetchMappings() {
      const mappings = await getIdToNameMappings();
      setIdToNameMapping(mappings);
    }
    fetchMappings();
  }, []);

  useEffect(() => {
    const getLabel = (link: string) => {
      if (idToNameMapping.forms[link]) {
        return idToNameMapping.forms[link];
      }
      if (idToNameMapping.users[link]) {
        return idToNameMapping.users[link];
      }
      if (idToNameMapping.teams[link]) {
        return idToNameMapping.teams[link];
      }
      return link[0].toUpperCase() + link.slice(1);
    };

    const labels = pathNames.map(getLabel);
    setPathNamesWithLabels(labels);
  }, [paths, idToNameMapping]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={"/"}>Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathNames.length > 0 && <BreadcrumbSeparator />}
        {pathNamesWithLabels.map((link, index) => {
          const href = `/${pathNames.slice(0, index + 1).join("/")}`;
          const isLastPath = pathNames.length === index + 1;
          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                {!isLastPath ? (
                  <BreadcrumbLink asChild className="truncate max-w-[100px]">
                    <Link href={href}>{link}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="truncate max-w-[100px]">
                    {link}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {pathNames.length !== index + 1 && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumb;
