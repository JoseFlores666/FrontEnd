/**
 * v0 by Vercel.
 * @see https://v0.dev/t/bKtRdzGkB4q
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function Component() {
  return (
    <div className="w-full max-w-3xl mx-auto p-6 md:p-8">
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted p-4 md:p-6">
          <h2 className="text-xl font-semibold">Llenado Exclusivo para el DEP</h2>
        </div>
        <div className="p-4 md:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" type="date" />
            </div>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Input type="number" />
                  </TableCell>
                  <TableCell>
                    <Input />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <CopyIcon className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Input type="number" />
                  </TableCell>
                  <TableCell>
                    <Input />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <CopyIcon className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="p-4 bg-muted">
              <Button variant="outline" className="w-full">
                Agregar más
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="observations">Observaciones</Label>
            <Textarea id="observations" rows={4} />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Guardar</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CopyIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  )
}


function TrashIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}


function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}