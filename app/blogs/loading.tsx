import { Container, Table } from "@radix-ui/themes"
import React from "react"
import { Skeleton } from "@/app/components"
import IssueActions from "./IssueActions"

const loading = () => {
  const issues = [1, 2, 3, 4, 5]
  return (
    <Container className="content-page-shell min-h-[120vh]">
      <div className="space-y-3 p-5">
        <IssueActions />
        <div className="data-table-shell">
          <Table.Root variant="surface">
            <Table.Header className="data-table-header">
              <Table.Row className="data-table-header">
                <Table.ColumnHeaderCell>标题</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="hidden md:table-cell">
                  博客类型
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="hidden md:table-cell">
                  创建于
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {issues.map((issue) => (
                <Table.Row key={issue} className="data-table-row">
                  <Table.Cell>
                    <Skeleton />
                    <div className="block md:hidden">
                      <Skeleton />
                    </div>
                  </Table.Cell>
                  <Table.Cell className="hidden md:table-cell">
                    <Skeleton />
                  </Table.Cell>
                  <Table.Cell className="hidden md:table-cell">
                    <Skeleton />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </div>
      </div>
    </Container>
  )
}

export default loading
