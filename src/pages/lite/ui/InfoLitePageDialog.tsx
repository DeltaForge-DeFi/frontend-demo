import { Button } from "@/shared/ui/Button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog"
import { Copy } from "lucide-react"


export const InfoLitePageDialog = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="rounded-full">info 💡</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <div className="flex flex-col items-center space-y-4 mb-2">
                <span className="mb-2 font-medium">Lite page info</span>
                    <span>STEP 1</span><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
                    <span>STEP 2</span><p>when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing</p>
                    <span>STEP 3</span><p>Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                </div>
                <DialogFooter className="sm:justify-start">
                    <Button type="button" variant="secondary">
                        Read More
                    </Button>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}