export type Post = {
  id: string
  owner_id: string
  title: string
  text_content: string
  createedAt: string
  updatedAt: string
  isLiked: boolean
  likes_count: number
  UsersFeedback?: UsersScore[]
}

type UsersScore = {
  property: string
  score: number
}
